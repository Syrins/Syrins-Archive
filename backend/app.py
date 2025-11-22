from flask import Flask, jsonify, send_from_directory, request, abort, redirect
from flask_cors import CORS
import os
from pathlib import Path
import hashlib
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

ALLOWED_DOMAIN = 'share.syrins.tech'

@app.before_request
def check_domain():
    if request.path == '/health':
        return
    
    origin = request.headers.get('Origin', '')
    referer = request.headers.get('Referer', '')
    host = request.headers.get('Host', '')
    
    if 'localhost' in host or '127.0.0.1' in host:
        return
    
    is_valid = (
        ALLOWED_DOMAIN in origin or 
        ALLOWED_DOMAIN in referer or
        ALLOWED_DOMAIN in host
    )
    
    if not is_valid:
        return redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', code=302)

SECRET_KEY = os.environ.get('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is required!")

def generate_valid_token():
    now = datetime.utcnow()
    tokens = []
    for minute_offset in range(-5, 1):
        time_key = now.replace(second=0, microsecond=0)
        time_key = time_key.replace(minute=time_key.minute + minute_offset)
        time_str = time_key.strftime('%Y%m%d%H%M')
        token = hashlib.sha256(f"{SECRET_KEY}{time_str}".encode()).hexdigest()[:16]
        tokens.append(token)
    return tokens

def check_token():
    token = request.headers.get('X-API-Token') or request.args.get('token')
    valid_tokens = generate_valid_token()
    
    if token not in valid_tokens:
        abort(403, 'Invalid or expired token')

BASE_DIR = Path(__file__).parent.parent

IMAGES_DIR = BASE_DIR / "images"
TEXT_DIR = BASE_DIR / "text"

IMAGES_DIR.mkdir(exist_ok=True)
TEXT_DIR.mkdir(exist_ok=True)

print(f"📁 Images directory: {IMAGES_DIR}")
print(f"📄 Text directory: {TEXT_DIR}")

IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.avif', '.heic'}
TEXT_EXTENSIONS = {'.txt', '.md', '.js', '.ts', '.tsx', '.jsx', '.json', '.css', '.html', '.py', '.sh', '.yml', '.yaml'}

def get_all_files(directory, extensions):
    files = []
    if not directory.exists():
        return files
    
    for root, dirs, filenames in os.walk(directory):
        for filename in filenames:
            if any(filename.lower().endswith(ext) for ext in extensions):
                full_path = Path(root) / filename
                relative_path = full_path.relative_to(BASE_DIR)
                url_path = "/" + str(relative_path).replace("\\", "/")
                files.append(url_path)
    
    return files

@app.route('/')
@app.route('/api/')
def index():
    return jsonify({
        'status': 'ok',
        'service': 'Syrins Share API',
        'version': '1.0',
        'endpoints': {
            'images': '/api/images',
            'text_files': '/api/text-files',
            'health': '/health'
        },
        'note': 'Authentication required for all endpoints'
    })

@app.route('/api/images', methods=['GET'])
@app.route('/images', methods=['GET'])
def get_images():
    check_token()
    images = get_all_files(IMAGES_DIR, IMAGE_EXTENSIONS)
    return jsonify(images)

@app.route('/api/images/<path:filename>')
@app.route('/images/<path:filename>')
def serve_image(filename):
    check_token()
    return send_from_directory(IMAGES_DIR, filename)

@app.route('/api/text-files', methods=['GET'])
@app.route('/text-files', methods=['GET'])
def get_text_files():
    check_token()
    files = []
    
    if TEXT_DIR.exists():
        for root, dirs, filenames in os.walk(TEXT_DIR):
            for filename in filenames:
                if any(filename.lower().endswith(ext) for ext in TEXT_EXTENSIONS):
                    full_path = Path(root) / filename
                    relative_path = full_path.relative_to(BASE_DIR)
                    url_path = "/api/text/" + str(relative_path.relative_to(TEXT_DIR.relative_to(BASE_DIR))).replace("\\", "/")
                    
                    try:
                        with open(full_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        files.append({
                            'path': url_path,
                            'content': content
                        })
                    except Exception as e:
                        print(f"Error reading {filename}: {e}")
    
    return jsonify(files)

@app.route('/api/text/<path:filename>')
@app.route('/text/<path:filename>')
def serve_text(filename):
    check_token()
    return send_from_directory(TEXT_DIR, filename)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'images_count': len(get_all_files(IMAGES_DIR, IMAGE_EXTENSIONS)),
        'text_files_count': len([f for f in get_all_files(TEXT_DIR, TEXT_EXTENSIONS)])
    })

if __name__ == '__main__':
    print(f"📁 Images directory: {IMAGES_DIR}")
    print(f"📄 Text directory: {TEXT_DIR}")
    print(f"🚀 Starting Flask server on http://localhost:945")
    app.run(host='0.0.0.0', port=945, debug=True)

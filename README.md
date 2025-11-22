# 🗂️ Syrins Archive

<div align="center">

![Syrins Archive](https://i.hizliresim.com/c5ialia.png)

**A modern, secure personal archive system for sharing code snippets and images**

[English](#english) • [Türkçe](#türkçe)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)](https://flask.palletsprojects.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

<a name="english"></a>

## 🌟 Overview

Syrins Archive is a full-stack web application designed for securely sharing and managing personal code snippets and images. Built with modern technologies and featuring a beautiful, responsive UI with dark mode support and bilingual interface (English/Turkish).

### ✨ Key Features

- 📝 **Code Snippet Management** - Store and share code files with syntax highlighting
- 🖼️ **Image Gallery** - Organize and display images with fullscreen preview
- 🔐 **Time-Based Security** - Dynamic token authentication that rotates every minute
- 🌍 **Bilingual Interface** - Seamless switching between English and Turkish
- 🎨 **Modern UI/UX** - Built with Radix UI and Tailwind CSS
- 🌙 **Dark Mode** - Full dark/light theme support
- 📱 **Fully Responsive** - Optimized for all screen sizes
- 🔍 **Search & Filter** - Quickly find files and images
- 📋 **Copy & Download** - Easy content sharing
- 🚀 **Fast Performance** - Powered by Vite and React Query

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 7.2
- **UI Library**: Radix UI + Shadcn/ui
- **Styling**: Tailwind CSS 3.4
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Theme**: next-themes

### Backend
- **Framework**: Flask 3.0 (Python)
- **CORS**: Flask-CORS 4.0
- **Security**: Time-based token authentication
- **File Serving**: Static file management

### DevOps
- **Deployment**: Vercel (Frontend) + Custom (Backend)
- **Environment**: Node.js 18+ / Python 3.8+
- **Package Manager**: npm / pip

## 📋 Prerequisites

- Node.js 18.x or higher
- Python 3.8 or higher
- npm or bun package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/syrins/syrins-archive.git
cd syrins-archive
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file in root directory
cat > .env << EOF
VITE_SITE_URL=http://localhost:8080
VITE_API_TOKEN=your-secret-key-here
EOF
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file in backend directory
cat > .env << EOF
SECRET_KEY=your-secret-key-here
EOF
```

**Important**: Use the same secret key in both `.env` files for authentication to work properly.

### 4. Project Structure

Create the following directories for your content:

```bash
# From project root
mkdir -p images text
```

- Place your images in the `images/` folder
- Place your text/code files in the `text/` folder

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
# Backend runs on http://localhost:945
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:8080
```

Visit `http://localhost:8080` in your browser.

### Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## 🔒 Security Features

### Time-Based Token Authentication

The application uses a unique security system:

1. **Dynamic Token Generation**: Tokens are generated based on the current UTC timestamp (rounded to the minute)
2. **5-Minute Grace Period**: Accepts tokens from the last 5 minutes to handle network delays
3. **SHA-256 Hashing**: Tokens are cryptographically secure
4. **Domain Restriction**: Backend only accepts requests from configured domains

### Token Algorithm

```python
token = sha256(SECRET_KEY + YYYYMMDDHHMM).hexdigest()[:16]
```

Both frontend and backend generate identical tokens, eliminating the need for a database.

## 📁 Project Structure

```
syrins-archive/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Backend environment variables
│   └── start.bat          # Windows start script
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Footer component
│   │   ├── FileCard.tsx  # Code file card
│   │   └── ImageCard.tsx # Image card
│   ├── pages/            # Route pages
│   │   ├── Index.tsx     # Home/Files page
│   │   ├── Images.tsx    # Image gallery
│   │   ├── FileDetail.tsx   # File viewer
│   │   ├── ImageDetail.tsx  # Image viewer
│   │   └── NotFound.tsx     # 404 page
│   ├── data/             # Data fetching
│   │   ├── mockFiles.ts  # Files API
│   │   └── mockImages.ts # Images API
│   ├── contexts/         # React contexts
│   │   └── language.tsx  # i18n context
│   ├── lib/              # Utilities
│   │   ├── translations.ts  # Translation strings
│   │   └── languageMeta.ts  # Language metadata
│   └── hooks/            # Custom hooks
├── public/               # Static assets
├── images/              # Your image files
├── text/                # Your code/text files
├── .env                 # Frontend environment
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind configuration
└── package.json         # Dependencies
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /health` - Health check (no auth required)

### Protected Endpoints (require X-API-Token header)
- `GET /api/images` - List all images
- `GET /api/images/:path` - Serve specific image
- `GET /api/text-files` - List all text files with content
- `GET /api/text/:path` - Serve specific text file

## 🎨 Customization

### Theme Colors

Edit `src/index.css` to customize the color scheme:

```css
:root {
  --primary: 220 70% 50%;
  --secondary: 210 40% 96%;
  /* ... more variables */
}
```

### Translations

Add or modify translations in `src/lib/translations.ts`:

```typescript
export const translations = {
  en: { /* English translations */ },
  tr: { /* Turkish translations */ }
}
```

### Supported File Types

**Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.svg`, `.webp`, `.avif`, `.heic`

**Text/Code**: `.txt`, `.md`, `.js`, `.ts`, `.tsx`, `.jsx`, `.json`, `.css`, `.html`, `.py`, `.sh`, `.yml`, `.yaml`

## 🚢 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SITE_URL`: Your domain
   - `VITE_API_TOKEN`: Your secret key
4. Deploy

### Backend (Any Python Host)

1. Upload `backend/` folder
2. Set environment variable `SECRET_KEY`
3. Install dependencies: `pip install -r requirements.txt`
4. Run: `python app.py`
5. Configure to run on port 945

### Domain Configuration

Update `ALLOWED_DOMAIN` in `backend/app.py` to match your production domain.

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Backend Not Starting
- Check if port 945 is available
- Verify `.env` file exists with `SECRET_KEY`
- Install dependencies: `pip install -r requirements.txt`

### Authentication Failed
- Ensure both `.env` files use the same secret key
- Check system time is correct (UTC-based tokens)
- Verify `X-API-Token` header is being sent

### Images/Files Not Loading
- Confirm files exist in `images/` and `text/` directories
- Check file extensions are supported
- Verify backend is running

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Syrins**
- GitHub: [@syrins](https://github.com/syrins)
- Website: [share.syrins.tech](https://share.syrins.tech)

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) - Unstyled UI components
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon set

---

<a name="türkçe"></a>

## 🌟 Genel Bakış

Syrins Archive, kod parçacıklarını ve görselleri güvenli bir şekilde paylaşmak için tasarlanmış modern bir web uygulamasıdır. Karanlık mod desteği ve iki dilli arayüz (İngilizce/Türkçe) ile modern teknolojiler kullanılarak geliştirilmiştir.

### ✨ Öne Çıkan Özellikler

- 📝 **Kod Parçacığı Yönetimi** - Sözdizimi vurgulama ile kod dosyalarını saklayın ve paylaşın
- 🖼️ **Görsel Galerisi** - Tam ekran önizleme ile görselleri düzenleyin ve görüntüleyin
- 🔐 **Zamana Dayalı Güvenlik** - Her dakika değişen dinamik token doğrulaması
- 🌍 **İki Dilli Arayüz** - İngilizce ve Türkçe arasında sorunsuz geçiş
- 🎨 **Modern UI/UX** - Radix UI ve Tailwind CSS ile oluşturuldu
- 🌙 **Karanlık Mod** - Tam karanlık/aydınlık tema desteği
- 📱 **Tam Responsive** - Tüm ekran boyutları için optimize
- 🔍 **Arama & Filtreleme** - Dosya ve görselleri hızlıca bulun
- 📋 **Kopyala & İndir** - Kolay içerik paylaşımı
- 🚀 **Hızlı Performans** - Vite ve React Query destekli

## 🏗️ Teknoloji Yığını

### Frontend
- **Framework**: React 18.3 + TypeScript
- **Build Aracı**: Vite 7.2
- **UI Kütüphanesi**: Radix UI + Shadcn/ui
- **Stil**: Tailwind CSS 3.4
- **Durum Yönetimi**: TanStack Query (React Query)
- **Yönlendirme**: React Router v6
- **İkonlar**: Lucide React
- **Tema**: next-themes

### Backend
- **Framework**: Flask 3.0 (Python)
- **CORS**: Flask-CORS 4.0
- **Güvenlik**: Zamana dayalı token doğrulaması
- **Dosya Sunumu**: Statik dosya yönetimi

## 📋 Gereksinimler

- Node.js 18.x veya üzeri
- Python 3.8 veya üzeri
- npm veya bun paket yöneticisi

## 🚀 Kurulum

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/kullaniciadi/syrins-archive.git
cd syrins-archive
```

### 2. Frontend Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# Kök dizinde .env dosyası oluştur
echo VITE_SITE_URL=http://localhost:8080 > .env
echo VITE_API_TOKEN=sizin-gizli-anahtariniz >> .env
```

### 3. Backend Kurulumu

```bash
cd backend

# Sanal ortam oluştur (opsiyonel ama önerilen)
python -m venv venv
venv\Scripts\activate  # Windows'ta

# Bağımlılıkları yükle
pip install -r requirements.txt

# backend dizininde .env dosyası oluştur
echo SECRET_KEY=sizin-gizli-anahtariniz > .env
```

**Önemli**: Kimlik doğrulamanın çalışması için her iki `.env` dosyasında da aynı gizli anahtarı kullanın.

### 4. İçerik Klasörlerini Oluşturun

```bash
# Proje kök dizininden
mkdir images text
```

- Görsellerinizi `images/` klasörüne yerleştirin
- Metin/kod dosyalarınızı `text/` klasörüne yerleştirin

## 🎯 Uygulamayı Çalıştırma

### Geliştirme Modu

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
# Backend http://localhost:945 adresinde çalışır
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend http://localhost:8080 adresinde çalışır
```

Tarayıcınızda `http://localhost:8080` adresini ziyaret edin.

### Production Build

```bash
# Frontend'i derle
npm run build

# Production build'i önizle
npm run preview
```

## 🔒 Güvenlik Özellikleri

### Zamana Dayalı Token Doğrulaması

Uygulama benzersiz bir güvenlik sistemi kullanır:

1. **Dinamik Token Üretimi**: Token'lar güncel UTC zaman damgasına göre üretilir (dakikaya yuvarlanır)
2. **5 Dakikalık Tolerans**: Ağ gecikmelerini karşılamak için son 5 dakikanın token'larını kabul eder
3. **SHA-256 Hashing**: Token'lar kriptografik olarak güvenlidir
4. **Domain Kısıtlaması**: Backend sadece yapılandırılmış domain'lerden gelen istekleri kabul eder

### Token Algoritması

```python
token = sha256(SECRET_KEY + YYYYAADDSS).hexdigest()[:16]
```

Frontend ve backend aynı token'ları üretir, veritabanı gerekmez.

## 📁 Proje Yapısı

```
syrins-archive/
├── backend/
│   ├── app.py              # Flask API sunucusu
│   ├── requirements.txt    # Python bağımlılıkları
│   ├── .env               # Backend ortam değişkenleri
│   └── start.bat          # Windows başlatma scripti
├── src/
│   ├── components/        # React bileşenleri
│   │   ├── ui/           # Shadcn UI bileşenleri
│   │   ├── Header.tsx    # Navigasyon başlığı
│   │   ├── Footer.tsx    # Footer bileşeni
│   │   ├── FileCard.tsx  # Kod dosyası kartı
│   │   └── ImageCard.tsx # Görsel kartı
│   ├── pages/            # Sayfa rotaları
│   │   ├── Index.tsx     # Ana/Dosyalar sayfası
│   │   ├── Images.tsx    # Görsel galerisi
│   │   ├── FileDetail.tsx   # Dosya görüntüleyici
│   │   ├── ImageDetail.tsx  # Görsel görüntüleyici
│   │   └── NotFound.tsx     # 404 sayfası
│   ├── data/             # Veri çekme
│   │   ├── mockFiles.ts  # Dosyalar API'si
│   │   └── mockImages.ts # Görseller API'si
│   ├── contexts/         # React context'leri
│   │   └── language.tsx  # i18n context
│   ├── lib/              # Yardımcılar
│   │   ├── translations.ts  # Çeviri metinleri
│   │   └── languageMeta.ts  # Dil metadata'sı
│   └── hooks/            # Özel hook'lar
├── public/               # Statik varlıklar
├── images/              # Görsel dosyalarınız
├── text/                # Kod/metin dosyalarınız
├── .env                 # Frontend ortam değişkenleri
├── vite.config.ts       # Vite yapılandırması
├── tailwind.config.ts   # Tailwind yapılandırması
└── package.json         # Bağımlılıklar
```

## 🌐 API Uç Noktaları

### Herkese Açık
- `GET /health` - Sağlık kontrolü (auth gerekmez)

### Korumalı (X-API-Token header gerektirir)
- `GET /api/images` - Tüm görselleri listele
- `GET /api/images/:path` - Belirli görseli sun
- `GET /api/text-files` - Tüm metin dosyalarını içerikleriyle listele
- `GET /api/text/:path` - Belirli metin dosyasını sun

## 🎨 Özelleştirme

### Tema Renkleri

`src/index.css` dosyasını düzenleyerek renk şemasını özelleştirin:

```css
:root {
  --primary: 220 70% 50%;
  --secondary: 210 40% 96%;
  /* ... daha fazla değişken */
}
```

### Çeviriler

`src/lib/translations.ts` dosyasında çevirileri ekleyin veya düzenleyin:

```typescript
export const translations = {
  en: { /* İngilizce çeviriler */ },
  tr: { /* Türkçe çeviriler */ }
}
```

### Desteklenen Dosya Türleri

**Görseller**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.svg`, `.webp`, `.avif`, `.heic`

**Metin/Kod**: `.txt`, `.md`, `.js`, `.ts`, `.tsx`, `.jsx`, `.json`, `.css`, `.html`, `.py`, `.sh`, `.yml`, `.yaml`

## 🚢 Deployment

### Frontend (Vercel)

1. Kodunuzu GitHub'a yükleyin
2. Vercel'de projeyi import edin
3. Ortam değişkenlerini ekleyin:
   - `VITE_SITE_URL`: Domain adresiniz
   - `VITE_API_TOKEN`: Gizli anahtarınız
4. Deploy edin

### Backend (Herhangi bir Python Host)

1. `backend/` klasörünü yükleyin
2. `SECRET_KEY` ortam değişkenini ayarlayın
3. Bağımlılıkları yükleyin: `pip install -r requirements.txt`
4. Çalıştırın: `python app.py`
5. Port 945'te çalışacak şekilde yapılandırın

### Domain Yapılandırması

Production domain'inize uyması için `backend/app.py` dosyasındaki `ALLOWED_DOMAIN` değişkenini güncelleyin.

## 🛠️ Komutlar

```bash
npm run dev          # Geliştirme sunucusunu başlat
npm run build        # Production için derle
npm run preview      # Production build'i önizle
npm run lint         # ESLint çalıştır
```

## 🐛 Sorun Giderme

### Backend Başlamıyor
- Port 945'in müsait olduğunu kontrol edin
- `.env` dosyasının `SECRET_KEY` ile mevcut olduğunu doğrulayın
- Bağımlılıkları yükleyin: `pip install -r requirements.txt`

### Kimlik Doğrulama Başarısız
- Her iki `.env` dosyasında da aynı gizli anahtarın kullanıldığından emin olun
- Sistem saatinin doğru olduğunu kontrol edin (UTC-tabanlı token'lar)
- `X-API-Token` header'ının gönderildiğini doğrulayın

### Görseller/Dosyalar Yüklenmiyor
- Dosyaların `images/` ve `text/` dizinlerinde bulunduğunu onaylayın
- Dosya uzantılarının desteklendiğini kontrol edin
- Backend'in çalıştığını doğrulayın

## 📄 Lisans

Bu proje açık kaynaklıdır ve MIT Lisansı altında mevcuttur.

## 👤 Yazar

**Syrins**
- GitHub: [@kullaniciadi](https://github.com/kullaniciadi)
- Website: [share.syrins.tech](https://share.syrins.tech)

## 🙏 Teşekkürler

- [Radix UI](https://www.radix-ui.com/) - Stilsiz UI bileşenleri
- [Shadcn/ui](https://ui.shadcn.com/) - Güzel bileşen kütüphanesi
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - İkon seti

---

<div align="center">

**Made with ❤️ by Syrins**

⭐ Star this repo if you find it useful!

</div>
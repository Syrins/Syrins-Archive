const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|bmp|svg|webp|avif|heic)$/i;

const API_BASE = import.meta.env.PROD 
  ? `${window.location.protocol}//${window.location.host}` 
  : '';

const SECRET_KEY = import.meta.env.VITE_API_TOKEN;
if (!SECRET_KEY) {
  throw new Error('VITE_API_TOKEN is required in .env file');
}

async function generateToken(): Promise<string> {
  const now = new Date();
  const timeStr = 
    now.getUTCFullYear() +
    String(now.getUTCMonth() + 1).padStart(2, '0') +
    String(now.getUTCDate()).padStart(2, '0') +
    String(now.getUTCHours()).padStart(2, '0') +
    String(now.getUTCMinutes()).padStart(2, '0');
  
  const message = SECRET_KEY + timeStr;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16);
}

const toTitleCase = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  description: string;
  category?: string;
}

const buildImagesFromAPI = async (): Promise<ImageFile[]> => {
  try {
    const token = await generateToken();
    const response = await fetch(`${API_BASE}/api/images`, {
      headers: {
        'X-API-Token': token
      }
    });
    if (!response.ok) return [];
    const imagePaths: string[] = await response.json();
    
    const baseDate = Date.UTC(2024, 0, 1);
    
    return imagePaths
      .map((url, index) => {
        const fileName = url.split("/").pop() ?? `image-${index + 1}`;
        const withoutExtension = fileName.replace(/\.[^.]+$/, "");
        const name = toTitleCase(withoutExtension);
        const segmentParts = url.split("/");
        const categorySegment = segmentParts.length > 3 ? segmentParts[segmentParts.length - 2] : "general";
        const category = toTitleCase(categorySegment);
        const id = slugify(url.replace(/\.[^.]+$/, "")) || `image-${index + 1}`;
        const description = `${name} capture from the ${category} lane.`;

        return {
          id,
          name,
          url,
          createdAt: new Date(baseDate),
          description,
          category,
        } satisfies ImageFile;
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((image, sortedIndex) => ({
        ...image,
        createdAt: new Date(baseDate + sortedIndex * 24 * 60 * 60 * 1000),
      }));
  } catch (error) {
    console.error('Failed to load images from API:', error);
    return [];
  }
};

export let mockImages: ImageFile[] = [];

export const getImages = async (): Promise<ImageFile[]> => {
  return buildImagesFromAPI();
};

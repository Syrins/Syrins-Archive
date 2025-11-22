const MIME_LOOKUP: Record<string, string> = {
  txt: "text/plain",
  md: "text/markdown",
  js: "application/javascript",
  ts: "application/typescript",
  tsx: "text/tsx",
  jsx: "text/jsx",
  json: "application/json",
  css: "text/css",
  html: "text/html",
  py: "text/x-python",
  sh: "application/x-sh",
  yml: "text/yaml",
  yaml: "text/yaml",
};

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

const textEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

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

export interface TextFile {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  preview: string;
  type?: string;
  size?: string;
  description?: string;
}

const buildFilesFromAPI = async (): Promise<TextFile[]> => {
  try {
    const token = await generateToken();
    const response = await fetch(`${API_BASE}/api/text-files`, {
      headers: {
        'X-API-Token': token
      }
    });
    if (!response.ok) return [];
    const textFiles: Array<{ path: string; content: string }> = await response.json();
    
    const baseDate = Date.UTC(new Date().getFullYear(), 0, 1);
    
    return textFiles
      .map(({ path: filePath, content }, index) => {
        const fileName = filePath.split("/").pop() ?? `entry-${index + 1}`;
        const extension = fileName.split(".").pop()?.toLowerCase() ?? "txt";
        const type = MIME_LOOKUP[extension] ?? `text/${extension || "plain"}`;
        const id = slugify(filePath.replace(/\.[^.]+$/, "")) || `entry-${index + 1}`;
        const normalizedContent = content.trim();
        const previewSource = normalizeWhitespace(normalizedContent);
        const preview = previewSource.slice(0, 220) + (previewSource.length > 220 ? "…" : "");
        const firstLine = normalizedContent.split(/\r?\n/)[0];
        const description = firstLine || `Excerpt from ${fileName}`;
        const bytes = textEncoder ? textEncoder.encode(content).length : content.length;
        const size = `${Math.max(1, Math.round((bytes / 1024) * 10) / 10)} KB`;
        return {
          id,
          name: fileName,
          content,
          createdAt: new Date(baseDate),
          preview,
          type,
          size,
          description,
        } satisfies TextFile;
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((file, sortedIndex) => ({
        ...file,
        createdAt: new Date(baseDate + sortedIndex * 24 * 60 * 60 * 1000),
      }));
  } catch (error) {
    console.error('Failed to load text files from API:', error);
    return [];
  }
};

export let mockFiles: TextFile[] = [];

export const getFiles = async (): Promise<TextFile[]> => {
  return buildFilesFromAPI();
};

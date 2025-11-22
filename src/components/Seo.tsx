import { Helmet } from "react-helmet-async";

const FALLBACK_URL = "https://quick-paste-web.vercel.app";

const getSiteUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return import.meta.env.VITE_SITE_URL ?? FALLBACK_URL;
};

const composeUrl = (path?: string) => {
  const base = getSiteUrl();
  if (!path) return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
};

export const Seo = ({
  title,
  description,
  canonicalPath,
  keywords = [],
  ogImage,
  jsonLd,
  noindex = false,
}: SeoProps) => {
  const url = composeUrl(canonicalPath);
  const metaKeywords = keywords.length ? keywords.join(", ") : undefined;
  const defaultOg = composeUrl("/og-default.svg");
  const metaImage = ogImage ?? defaultOg;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={metaImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

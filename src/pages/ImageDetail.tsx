import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Maximize2, Share2, Heart } from "lucide-react";
import { getImages, type ImageFile } from "@/data/mockImages";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/language";
import { useToast } from "@/hooks/use-toast";
import { Seo } from "@/components/Seo";

const ImageDetail = () => {
  const { id } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    getImages().then(setImages);
  }, []);
  
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth && naturalHeight) {
      setDimensions({ width: naturalWidth, height: naturalHeight });
    }
  };

  const ratioLabel = useMemo(() => {
    if (!dimensions) {
      return "—";
    }
    const { width, height } = dimensions;
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    const simplifiedWidth = Math.round(width / divisor);
    const simplifiedHeight = Math.round(height / divisor);
    return `${simplifiedWidth}:${simplifiedHeight}`;
  }, [dimensions]);


  const image = useMemo(() => images.find((img) => img.id === id), [id, images]);

  if (!image) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Seo
          title="Görsel bulunamadı | Syrins Arşivi"
          description="Aradığınız görsel bu arşivde bulunamadı. Lütfen galeride başka bir kare seçin."
          noindex
        />
        <Header />
        <main className="container flex-1 py-16">
          <div className="mx-auto max-w-2xl rounded-[3rem] border border-border/70 bg-card/80 p-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.imageDetail.missingEyebrow}</p>
            <h1 className="mt-6 text-4xl font-semibold">{t.imageDetail.missingTitle}</h1>
            <p className="mt-4 text-muted-foreground">{t.imageDetail.missingDescription}</p>
            <Button asChild className="mt-8 rounded-full px-8 py-6 text-sm uppercase tracking-[0.4em]">
              <Link to="/images">{t.imageDetail.missingCta}</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyShareLink = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const temp = document.createElement("textarea");
        temp.value = url;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      toast({
        title: lang === "tr" ? "Bağlantı kopyalandı" : "Link copied",
        description: lang === "tr" ? "Görüntü bağlantısı panoya aktarıldı." : "Image link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: lang === "tr" ? "Paylaşım hatası" : "Share failed",
        description: lang === "tr" ? "Bağlantı kopyalanamadı." : "Could not copy the link.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const shareImage = async () => {
    if (!image || typeof window === "undefined") return;
    const payload = {
      title: image.name,
      text: image.description,
      url: window.location.href,
    };

    if (navigator && navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") {
          return;
        }
      }
    }

    await copyShareLink();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={`${image.name} | Syrins Arayüz Galerisi`}
        description={`${image.description} · ${formatDistanceToNow(image.createdAt, { addSuffix: true })} yüklendi.`}
        canonicalPath={`/image/${image.id}`}
        keywords={[image.category ?? "galeri", "ui görsel", "syrins"]}
        ogImage={image.url}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ImageObject',
          name: image.name,
          description: image.description,
          contentUrl: image.url,
          datePublished: image.createdAt.toISOString(),
          inLanguage: 'tr-TR',
        }}
      />
      <Header />
      <main className="container flex-1 space-y-12 pb-20 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Button variant="ghost" asChild className="rounded-full px-5 text-xs uppercase tracking-[0.4em]">
            <Link to="/images" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> {t.imageDetail.returnLabel}
            </Link>
          </Button>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setIsLiked(!isLiked)}
              className={`rounded-full text-xs uppercase tracking-[0.3em] ${isLiked ? "border-rose-400 text-rose-400" : ""}`}
            >
              <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              {isLiked ? t.imageDetail.markedLabel : t.imageDetail.markLabel}
            </Button>
            <Button variant="outline" onClick={handleDownload} className="rounded-full text-xs uppercase tracking-[0.3em]">
              <Download className="mr-2 h-4 w-4" /> {t.imageDetail.downloadLabel}
            </Button>
            <Button variant="outline" onClick={() => setIsFullscreen(true)} className="rounded-full text-xs uppercase tracking-[0.3em]">
              <Maximize2 className="mr-2 h-4 w-4" /> {t.imageDetail.fullscreenLabel}
            </Button>
          </div>
        </div>

        <section className="rounded-[3.2rem] border border-border/70 bg-card/80 p-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.imageDetail.eyebrow}</p>
                <h1 className="mt-6 text-4xl font-black leading-tight">{image.name}</h1>
                <p className="mt-3 text-sm uppercase tracking-[0.4em] text-muted-foreground">
                  {t.imageDetail.uploadedPrefix} {formatDistanceToNow(image.createdAt, { addSuffix: true })}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-border/70 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.imageDetail.channelLabel}</p>
                  <p className="mt-2 text-2xl font-semibold">{image.category}</p>
                </div>
                <div className="rounded-3xl border border-border/70 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.imageDetail.ratioLabel}</p>
                  <p className="mt-2 text-2xl font-semibold">{ratioLabel}</p>
                </div>
                <div className="rounded-3xl border border-border/70 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.imageDetail.statusLabel}</p>
                  <p className="mt-2 text-2xl font-semibold">{t.imageDetail.statusValue}</p>
                </div>
              </div>
              <div className="rounded-[2rem] border border-border/70 bg-background/70 p-6">
                <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.imageDetail.fieldNotes}</p>
                <p className="mt-3 text-muted-foreground">{image.description}</p>
                <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    {t.imageDetail.visibilityLabel}
                  </div>
                  <Button
                    variant="secondary"
                    className="rounded-full text-xs uppercase tracking-[0.4em]"
                    onClick={shareImage}
                  >
                    <Share2 className="mr-2 h-3 w-3" /> {t.imageDetail.shareLabel}
                  </Button>
                </div>
              </div>
            </div>
            <div className="rounded-[2.4rem] border border-border/70 bg-background/50 p-4">
              <div
                className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-black/30"
                role="button"
                tabIndex={0}
                onClick={() => setIsFullscreen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setIsFullscreen(true);
                  }
                }}
              >
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0">
                    <img
                      src={image.url}
                      alt={image.description}
                      className="h-full w-full object-cover"
                      onLoad={handleImageLoad}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="absolute bottom-6 right-6 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/80 backdrop-blur"
                >
                  {t.imageDetail.expandHint}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[96vw] max-h-[96vh] rounded-[2rem] border border-border/70 bg-background/95 p-4">
          <img
            src={image.url}
            alt={image.description}
            className="mx-auto max-h-[88vh] w-full rounded-[1.5rem] object-contain"
            onLoad={handleImageLoad}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ImageDetail;

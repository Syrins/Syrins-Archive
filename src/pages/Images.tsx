import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImageCard } from "@/components/ImageCard";
import { SearchBar } from "@/components/SearchBar";
import { getImages, type ImageFile } from "@/data/mockImages";
import { Seo } from "@/components/Seo";
import { Camera, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language";

const Images = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    getImages().then(setImages);
  }, []);
  
  const filteredImages = useMemo(
    () =>
      images.filter(
        (image) =>
          image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, images]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Syrins Arayüz Galerisi | UI Ekranları ve Görsel Günce"
        description="Haftalık küratörlü UI ekranları, layout çalışmaları ve kodla eşleşen görsel kronikler. Galeride arama yaparak aradığın stili bul."
        canonicalPath="/images"
        keywords={["ui galerisi", "arayüz ekranları", "syrins görseller"]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Syrins Arayüz Galerisi',
          description: 'UI ekranları ve tasarım kareleri koleksiyonu',
          inLanguage: 'tr-TR',
          url: 'https://quick-paste-web.vercel.app/images',
        }}
      />
      <Header />
      <main className="container space-y-16 pb-20 pt-8">
        <section className="rounded-[3rem] border border-border/60 bg-card/70 p-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.images.heroEyebrow}</div>
            <h1 className="text-5xl font-black leading-tight">{t.images.heroTitle}</h1>
            <p className="text-lg text-muted-foreground">{t.images.heroDescription}</p>
            <div className="flex flex-wrap gap-4">
              {t.images.tiers.map((tier) => (
                <div key={tier.label} className="rounded-full border border-border/70 px-4 py-2 text-sm uppercase tracking-[0.4em]">
                  {tier.label} · {tier.detail}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2.4rem] border border-border/60 bg-background/70 p-8">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
              <span>{t.images.searchTitle}</span>
              <span className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> {filteredImages.length} {t.images.framesLabel}
              </span>
            </div>
            <div className="mt-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.images.curatedLabel}</p>
                <p className="text-3xl font-semibold">{t.images.curatedValue}</p>
              </div>
              <div className="rounded-2xl border border-border/60 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.images.seriesLabel}</p>
                <p className="text-3xl font-semibold">{Math.max(1, Math.floor(filteredImages.length / 4))}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.images.galleryEyebrow}</p>
              <h2 className="text-4xl font-semibold">{t.images.galleryTitle}</h2>
              <p className="text-muted-foreground">{t.images.galleryDescription}</p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-border/70 px-4 py-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              <ImageIcon className="h-4 w-4" /> {t.images.galleryBadge} · {images.length}
            </div>
          </div>
          {filteredImages.length === 0 ? (
            <div className="rounded-[2.5rem] border border-border/60 bg-card/80 p-12 text-center text-muted-foreground">
              {t.images.galleryFallback}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Images;

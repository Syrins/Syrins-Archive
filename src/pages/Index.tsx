import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileCard } from "@/components/FileCard";
import { SearchBar } from "@/components/SearchBar";
import { Seo } from "@/components/Seo";
import { getFiles, type TextFile } from "@/data/mockFiles";
import { Feather, FolderKanban, Layers3, NotebookPen } from "lucide-react";
import { useLanguage } from "@/contexts/language";

const ritualIcons = [NotebookPen, Layers3, Feather];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<TextFile[]>([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    getFiles().then(setFiles);
  }, []);
  
  const filteredFiles = useMemo(
    () =>
      files.filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, files]
  );

  const heroFiles = filteredFiles.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Syrins Kod Arşivi | Tekrar Kullanılabilir Kod ve Arayüzler"
        description="Frontend kitleri, UI şablonları ve paylaşılabilir metin notlarıyla dolu Syrins arşivini keşfet. Türkçe kürasyon, hızlı arama ve detay sayfalarıyla en çok aranan kodları bul."
        canonicalPath="/"
        keywords={["syrins", "kod arşivi", "ui kit", "frontend kod", "paylaşılabilir metin"]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Syrins Kod Arşivi',
          url: 'https://quick-paste-web.vercel.app/',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://quick-paste-web.vercel.app/?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
          inLanguage: 'tr-TR',
        }}
      />
      <Header />
      <main className="container space-y-16 pb-20 pt-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="arc-panel grid gap-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.45em] text-muted-foreground">
              <span>{t.index.eyebrow}</span>
              <span className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4" /> {files.length} {t.index.heroEntriesLabel}
              </span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.6em] text-muted-foreground">{t.index.capsule}</p>
              <h1 className="mt-4 text-5xl font-black leading-tight sm:text-6xl">{t.index.heroTitle}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{t.index.heroSubtitle}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {t.index.rituals.map(({ title, description }, index) => {
                const Icon = ritualIcons[index % ritualIcons.length];
                return (
                  <div key={title} className="rounded-3xl border border-border/60 bg-card/80 p-5">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2.5rem] border border-border/70 bg-card/80 p-8 grid gap-8">
              <div className="text-sm uppercase tracking-[0.4em] text-muted-foreground">{t.index.searchPanelLabel}</div>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 px-4 py-5 text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.index.manuscriptsLabel}</p>
                  <p className="text-3xl font-semibold">{filteredFiles.length}</p>
                </div>
                <div className="rounded-2xl border border-border/60 px-4 py-5 text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.index.chaptersLabel}</p>
                  <p className="text-3xl font-semibold">{Math.max(1, Math.floor(filteredFiles.length / 3))}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-border/70 bg-card/70 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.index.featuredLabel}</p>
              <div className="mt-4 grid gap-4">
                {heroFiles.map((file) => (
                  <Link
                    key={file.id}
                    to={`/file/${file.id}`}
                    className="flex items-center justify-between border-b border-border/50 pb-3 transition hover:text-primary hover:border-primary/40 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.index.editionLabel} #{file.id}
                      </p>
                      <p className="text-lg font-semibold">{file.name}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t.index.viewLabel} →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.index.latestEyebrow}</p>
              <h2 className="text-4xl font-semibold">{t.index.latestTitle}</h2>
              <p className="text-muted-foreground">{t.index.latestDescription}</p>
            </div>
          </div>
          {filteredFiles.length === 0 ? (
            <div className="rounded-[2.5rem] border border-border/70 bg-card/80 p-12 text-center text-muted-foreground">
              {t.index.emptyState}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Maximize2, Download, Share2, FileText } from "lucide-react";
import { getFiles, type TextFile } from "@/data/mockFiles";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useRef, useState, useEffect, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/language";
import { getLanguageMeta } from "@/lib/languageMeta";
import { Seo } from "@/components/Seo";

const FileDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [files, setFiles] = useState<TextFile[]>([]);
  const { t, lang } = useLanguage();
  const inlineCodeRef = useRef<HTMLPreElement>(null);
  const fullscreenCodeRef = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    getFiles().then(setFiles);
  }, []);
  
  const file = useMemo(() => files.find((f) => f.id === id), [id, files]);
  const languageMeta = useMemo(() => (file ? getLanguageMeta({ name: file.name, type: file.type }) : null), [file]);

  const signalBands: { label: string; value: ReactNode }[] = file
    ? [
        {
          label: t.fileDetail.signalLabels.format,
          value: (
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-background/70">
              {languageMeta?.icon ? (
                <img
                  src={languageMeta.icon}
                  alt=""
                  className="h-7 w-7 object-contain"
                  loading="lazy"
                />
              ) : (
                <FileText className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="sr-only">{languageMeta?.label ?? file.type ?? "Plain Text"}</span>
            </span>
          ),
        },
        { label: t.fileDetail.signalLabels.weight, value: `${file.size}` },
        {
          label: t.fileDetail.signalLabels.revision,
          value: formatDistanceToNow(file.createdAt, { addSuffix: true }),
        },
      ]
    : [];

  if (!file) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container flex-1 py-16">
          <div className="mx-auto max-w-2xl rounded-[3rem] border border-border/70 bg-card/80 p-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.fileDetail.missingEyebrow}</p>
            <h1 className="mt-6 text-4xl font-semibold">{t.fileDetail.missingTitle}</h1>
            <p className="mt-4 text-muted-foreground">{t.fileDetail.missingDescription}</p>
            <Button asChild className="mt-8 rounded-full px-8 py-6 text-sm uppercase tracking-[0.4em]">
              <Link to="/">{t.fileDetail.missingCta}</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const copyText = async (value: string) => {
    if (typeof window === "undefined") return;

    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const temp = document.createElement("textarea");
    temp.value = value;
    temp.style.position = "fixed";
    temp.style.top = "-9999px";
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  };

  const copyToClipboard = async () => {
    try {
      await copyText(file.content);
      toast({
        title: t.fileDetail.toastTitle,
        description: t.fileDetail.toastDescription,
        duration: 2400,
      });
    } catch (error) {
      toast({
        title: lang === "tr" ? "Kopyalama hatası" : "Copy failed",
        description:
          lang === "tr"
            ? "İçerik panoya gönderilemedi."
            : "Could not copy the content to clipboard.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const copyShareLink = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      await copyText(url);
      toast({
        title: lang === "tr" ? "Bağlantı kopyalandı" : "Link copied",
        description: lang === "tr" ? "Dosya bağlantısı panoya aktarıldı." : "File link copied to clipboard.",
        duration: 2400,
      });
    } catch (error) {
      toast({
        title: lang === "tr" ? "Paylaşım hatası" : "Share failed",
        description: lang === "tr" ? "Bağlantı kopyalanamadı." : "Could not copy the link.",
        variant: "destructive",
        duration: 2600,
      });
      console.error(error);
    }
  };

  const shareFile = async () => {
    if (!file || typeof window === "undefined") return;
    const sharePayload = {
      title: file.name,
      text: file.description ?? t.fileDetail.notesLabel,
      url: window.location.href,
    };

    if (navigator && navigator.share) {
      try {
        await navigator.share(sharePayload);
        toast({
          title: lang === "tr" ? "Paylaşıldı" : "Shared",
          description:
            lang === "tr" ? "Dosya bilgileri paylaşıldı." : "File details shared successfully.",
          duration: 2000,
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") {
          return;
        }
      }
    }

    await copyShareLink();
  };

  const downloadFile = () => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: lang === "tr" ? "İndirme hazır" : "Download ready",
      description: lang === "tr" ? `${file.name} indiriliyor.` : `${file.name} is downloading now.`,
      duration: 2300,
    });
  };

  const handleCodeKeyDown = (event: React.KeyboardEvent<HTMLPreElement>, element: HTMLPreElement | null) => {
    if (!element) return;
    const isSelectAll = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a";
    if (!isSelectAll) return;

    if (typeof window === "undefined") return;
    event.preventDefault();
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={`${file.name} | Syrins Kod Arşivi`}
        description={`${file.description ?? "Dosya detayı"} · ${formatDistanceToNow(file.createdAt, { addSuffix: true })} güncellendi.`}
        canonicalPath={`/file/${file.id}`}
        keywords={[file.type ?? "metin", "kod paylaşımı", "syrins dosya"]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'DigitalDocument',
          name: file.name,
          dateModified: file.createdAt.toISOString(),
          inLanguage: 'tr-TR',
          description: file.description,
          url: `https://quick-paste-web.vercel.app/file/${file.id}`,
        }}
      />
      <Header />
      <main className="container flex-1 space-y-12 pb-16 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Button variant="ghost" asChild className="rounded-full px-5 text-xs uppercase tracking-[0.4em]">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.fileDetail.backLabel}
            </Link>
          </Button>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={copyToClipboard} className="rounded-full text-xs uppercase tracking-[0.3em]">
              <Copy className="mr-2 h-4 w-4" /> {t.fileDetail.actions.copy}
            </Button>
            <Button variant="outline" onClick={downloadFile} className="rounded-full text-xs uppercase tracking-[0.3em]">
              <Download className="mr-2 h-4 w-4" /> {t.fileDetail.actions.download}
            </Button>
            <Button variant="outline" onClick={() => setIsFullscreen(true)} className="rounded-full text-xs uppercase tracking-[0.3em]">
              <Maximize2 className="mr-2 h-4 w-4" /> {t.fileDetail.actions.expand}
            </Button>
          </div>
        </div>

        <section className="rounded-[3rem] border border-border/70 bg-card/80 px-8 py-6 lg:px-10 lg:py-7">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.fileDetail.eyebrow}</p>
                <h1 className="mt-4 text-4xl font-black leading-tight">{file.name}</h1>
                <p className="mt-1.5 text-sm uppercase tracking-[0.4em] text-muted-foreground">
                  {t.fileDetail.curatedPrefix} {formatDistanceToNow(file.createdAt, { addSuffix: true })}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {signalBands.map((band) => (
                  <div key={band.label} className="rounded-3xl border border-border/70 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{band.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{band.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] border border-border/70 bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.fileDetail.notesLabel}</p>
                <p className="mt-2 text-muted-foreground">{file.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.fileDetail.liveLabel}
                  </div>
                  <button
                    className="rounded-full border border-border/60 px-4 py-2 hover:bg-border/10"
                    type="button"
                    onClick={shareFile}
                  >
                    <Share2 className="mr-2 inline h-3 w-3" /> {t.fileDetail.shareLabel}
                  </button>
                </div>
              </div>
            </div>
            <div className="relative rounded-[2.4rem] border border-border/70 bg-code-bg/70 p-5">
              <div className="absolute right-6 top-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                <span>{t.fileDetail.actions.copy}</span>
                <Button size="sm" variant="secondary" className="rounded-full" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-3 w-3" /> {t.fileDetail.copyNow}
                </Button>
              </div>
              <pre
                ref={inlineCodeRef}
                tabIndex={0}
                onKeyDown={(event) => handleCodeKeyDown(event, inlineCodeRef.current)}
                className="custom-scrollbar mt-12 max-h-[55vh] overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-code-foreground/90 focus:outline-none"
              >
                {file.content}
              </pre>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {t.fileDetail.fullscreenTitle}: {file.name}
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-[2rem] border border-border/70 bg-code-bg/80 p-6">
            <pre
              ref={fullscreenCodeRef}
              tabIndex={0}
              onKeyDown={(event) => handleCodeKeyDown(event, fullscreenCodeRef.current)}
              className="custom-scrollbar max-h-[70vh] overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-code-foreground/90 focus:outline-none"
            >
              {file.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default FileDetail;

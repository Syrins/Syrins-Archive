import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/language";
import { Seo } from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="404 - Sayfa Bulunamadı | share.syrins.tech"
        description="Aradığınız sayfa bulunamadı. Girdiğiniz adres share.syrins.tech üzerinde mevcut değil. Ana arşive dönebilir veya görselleri keşfedebilirsiniz."
        canonicalPath={location.pathname}
        noindex
        keywords={["404", "sayfa bulunamadı", "hata", "share.syrins.tech", "arşiv", "görsel paylaşımı", "kod paylaşımı", "Syrins"]}
        ogImage="/og-default.svg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "404 - Sayfa Bulunamadı | share.syrins.tech",
          "description": "Aradığınız sayfa bulunamadı. Girdiğiniz adres share.syrins.tech üzerinde mevcut değil. Ana arşive dönebilir veya görselleri keşfedebilirsiniz.",
          "url": `https://share.syrins.tech${location.pathname}`,
          "isPartOf": {
            "@type": "WebSite",
            "name": "share.syrins.tech",
            "url": "https://share.syrins.tech"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": "https://share.syrins.tech/images?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          ],
          "inLanguage": "tr-TR"
        }}
      />
      <Header />
      <main className="container flex-1 py-20">
        <div className="rounded-[3.5rem] border border-border/70 bg-card/80 p-12 text-center">
          <div className="mx-auto mb-10 flex h-32 w-32 items-center justify-center rounded-full border border-border/60">
            <AlertCircle className="h-16 w-16" />
          </div>
          <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.notFound.eyebrow}</p>
          <h1 className="mt-6 text-7xl font-black">404</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.notFound.description}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="rounded-full px-8 py-6 text-xs uppercase tracking-[0.4em]">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {t.notFound.backArchive}
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-8 py-6 text-xs uppercase tracking-[0.4em]">
              <Link to="/images" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t.notFound.browseImages}
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

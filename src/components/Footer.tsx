import { ArrowUpRight, Github, Mail, Twitter, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language";

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@syrins.dev" },
];

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-border/80 bg-gradient-to-b from-transparent to-secondary/40">
      <div className="container py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="arc-panel grain-overlay">
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              <span className="halo-pill px-4 py-2">{t.footer.badge}</span>
              <span className="flex items-center gap-2">
                <Waves className="h-4 w-4" /> {t.footer.wave}
              </span>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">{t.footer.archivistLabel}</p>
                <h3 className="text-3xl font-semibold">Syrins</h3>
                <p className="mt-2 text-sm text-muted-foreground/80">{t.footer.archivistDescription}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.footer.chapterLabel}</p>
                <h3 className="text-3xl font-semibold">{new Date().getFullYear()}</h3>
                <p className="mt-2 text-sm text-muted-foreground/80">{t.footer.chapterDescription}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link to="/" className="group rounded-2xl border border-border/70 px-4 py-4 transition hover:border-primary/50">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{t.footer.archiveCta}</p>
                <div className="mt-3 flex items-center justify-between">
                  <h4 className="text-2xl font-semibold">{t.footer.primaryTitle}</h4>
                  <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
              <Link to="/images" className="group rounded-2xl border border-border/70 px-4 py-4 transition hover:border-primary/50">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{t.footer.galleryCta}</p>
                <div className="mt-3 flex items-center justify-between">
                  <h4 className="text-2xl font-semibold">{t.footer.visualTitle}</h4>
                  <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[2.5rem] border border-border/60 bg-card/70 p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.footer.contactTag}</p>
              <h3 className="mt-4 text-3xl font-semibold">{t.footer.contactTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.footer.contactDescription}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/60 hover:text-primary"
                  aria-label={label}
                >
                  <Icon className="mr-2 inline h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.bottomNote.replace("{year}", new Date().getFullYear().toString())}</p>
          <p className="text-xs uppercase tracking-[0.5em]">{t.footer.bottomStamp}</p>
        </div>
      </div>
    </footer>
  );
};

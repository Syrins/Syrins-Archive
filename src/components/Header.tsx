import { Link, useLocation } from "react-router-dom";
import { Compass, Images, Layers3, Sparkles, Star } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language";
import { LanguageToggle } from "./LanguageToggle";

export const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.archive, href: "/", icon: Layers3 },
    { label: t.nav.gallery, href: "/images", icon: Images },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl">
      <div className="container py-6">
        <div className="grid gap-4 rounded-[2.2rem] border border-border/80 bg-background/80 px-6 py-4 md:grid-cols-[auto,1fr] md:items-center">
          <Link to="/" className="orbit-ring flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/5 text-primary">
              <Sparkles className="h-6 w-6" />
              <span className="absolute -right-1 -bottom-1 inline-flex items-center gap-1 rounded-full bg-foreground text-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
                SY
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">{t.header.badge}</p>
              <p className="text-3xl font-black tracking-tight gradient-text">{t.header.title}</p>
              <p className="text-sm text-muted-foreground">{t.header.subtitle}</p>
            </div>
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <nav className="flex flex-wrap items-center gap-2">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const isActive = location.pathname === href || location.pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    to={href}
                    className={cn(
                      "relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-transform",
                      "hover:scale-[1.03]",
                      isActive
                        ? "gradient-bg text-background shadow-[0_10px_30px_hsl(var(--primary)/0.2)]"
                        : "bg-card/70"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {isActive && (
                      <span className="absolute inset-x-4 -bottom-0.5 h-px w-[calc(100%-2rem)] bg-background/60" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <div className="halo-pill hidden items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground md:flex">
                <Compass className="h-3.5 w-3.5" /> {t.header.statusBadge}
              </div>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>
              {t.header.stats.liveIndex}: {new Date().getFullYear()}
            </span>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 flex items-center gap-3">
            <Star className="h-4 w-4 text-accent" />
            <span>{t.header.stats.artifacts}</span>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>{t.header.stats.signature}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

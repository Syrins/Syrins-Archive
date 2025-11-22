import { Link } from "react-router-dom";
import { Calendar, FileText, PenSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextFile } from "@/data/mockFiles";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/contexts/language";
import { getLanguageMeta } from "@/lib/languageMeta";

interface FileCardProps {
  file: TextFile;
}

export const FileCard = ({ file }: FileCardProps) => {
  const { t } = useLanguage();
  const languageMeta = getLanguageMeta({ name: file.name, type: file.type });

  return (
    <Link to={`/file/${file.id}`} className="group block h-full">
      <Card className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-card/90 px-5 py-6 transition hover:border-primary/40 hover:shadow-[0_30px_80px_hsl(var(--primary)/0.16)]">
        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" aria-hidden>
          <div className="gradient-bg absolute inset-0 mix-blend-overlay" />
        </div>
        <CardHeader className="relative z-10 space-y-3 p-0">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-2xl border border-border/60 p-3 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="text-right text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground/80">
              <span>{t.fileCard.docLabel}</span>
              <div className="text-foreground/70">#{file.id}</div>
            </div>
          </div>
          <CardTitle className="text-xl font-semibold leading-tight text-foreground/90 md:text-[1.55rem]">{file.name}</CardTitle>
          <CardDescription className="flex w-full items-center justify-between text-[0.68rem] uppercase tracking-[0.25em] text-muted-foreground/80">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {formatDistanceToNow(file.createdAt, { addSuffix: true })}
            </span>
            <span className="flex items-center gap-2">
              <PenSquare className="h-3.5 w-3.5" />
              {t.fileCard.curatedNote}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 mt-5 space-y-4 p-0">
          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground/90 md:text-[0.95rem]">{file.preview}</p>
          <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground/90">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 shadow-sm">
              {languageMeta.icon ? (
                <img
                  src={languageMeta.icon}
                  alt=""
                  className="h-5 w-5 object-contain"
                  loading="lazy"
                />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              <span className="sr-only">{languageMeta.label}</span>
            </span>
            <span>{t.fileCard.cta}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

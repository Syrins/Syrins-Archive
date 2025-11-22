import { Link } from "react-router-dom";
import { Calendar, Eye, ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageFile } from "@/data/mockImages";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/contexts/language";

interface ImageCardProps {
  image: ImageFile;
}

export const ImageCard = ({ image }: ImageCardProps) => {
  const { t } = useLanguage();

  return (
    <Link to={`/image/${image.id}`} className="group block h-full">
      <Card className="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-border/60 bg-card">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
            <div className="gradient-bg absolute inset-0 mix-blend-overlay" />
          </div>
          <img
            src={image.url}
            alt={image.description}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full border border-border/80 bg-background/80 px-4 py-1 text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground/90">
            <ImageIcon className="h-3.5 w-3.5" /> {t.imageCard.frameLabel} #{image.id}
          </div>
        </div>

        <CardHeader className="space-y-3 border-t border-border/60 px-6 pb-0 pt-6">
          <CardTitle className="text-xl font-semibold leading-tight text-foreground/90 md:text-[1.55rem]">{image.name}</CardTitle>
          <CardDescription className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.25em] text-muted-foreground/80">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {formatDistanceToNow(image.createdAt, { addSuffix: true })}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5" />
              {Math.floor(Math.random() * 500)} {t.imageCard.viewsLabel}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 text-muted-foreground">
          <p className="line-clamp-3 text-sm leading-relaxed md:text-[0.95rem]">{image.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

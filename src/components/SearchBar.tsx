import { Compass, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const { t } = useLanguage();

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-muted-foreground">
        <span>{t.searchBar.label}</span>
        <span className="hidden sm:flex items-center gap-2">
          <Compass className="h-3.5 w-3.5" /> {t.searchBar.secondary}
        </span>
      </div>
      <div className="relative">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-foreground/5 via-transparent to-accent/10 blur-2xl" />
        <div className="relative rounded-[2rem] border border-border/70 bg-background/80 px-5 py-3 shadow-[0_20px_60px_hsl(var(--primary)/0.08)]">
          <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.searchBar.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 border-0 bg-transparent pl-12 text-base font-medium placeholder:text-muted-foreground/70 focus-visible:ring-0"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {t.searchBar.prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onChange(prompt)}
            className="rounded-full border border-border/70 px-4 py-1 transition hover:border-primary/60 hover:text-primary"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

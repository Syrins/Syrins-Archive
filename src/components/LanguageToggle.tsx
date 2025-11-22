import { useLanguage } from "@/contexts/language";

const LANG_OPTIONS = [
  { value: "tr", label: "TR" },
  { value: "en", label: "EN" },
] as const;

export const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-border/60 bg-card/70 p-1 text-[11px] font-semibold uppercase tracking-[0.35em]">
      {LANG_OPTIONS.map(({ value, label }) => {
        const isActive = lang === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLang(value)}
            className={`relative rounded-full px-4 py-2 transition ${
              isActive ? "bg-foreground text-background shadow-[0_8px_20px_rgba(0,0,0,0.15)]" : "text-muted-foreground"
            }`}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

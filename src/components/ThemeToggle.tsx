import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-12 w-24 items-center rounded-full border border-border/60 bg-background/80 p-1 transition hover:border-primary/40"
    >
      <div
        className={
          "absolute inset-y-1 w-1/2 rounded-full gradient-bg transition-all" +
          (theme === "light" ? " translate-x-1" : " translate-x-[calc(100%-0.5rem)]")
        }
      />
      <span className="relative flex-1 flex items-center justify-center text-muted-foreground">
        <Sun className="h-4 w-4" />
      </span>
      <span className="relative flex-1 flex items-center justify-center text-muted-foreground">
        <Moon className="h-4 w-4" />
      </span>
    </button>
  );
};

import { TextFile } from "@/data/mockFiles";

interface LanguageMeta {
  label: string;
  icon: string;
}

type LanguageDefinition = {
  label: string;
  icon?: string;
  aliases: string[];
};

const devicon = (name: string, variant: string = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

const languageDefinitions: LanguageDefinition[] = [
  { label: "TypeScript", icon: devicon("typescript"), aliases: ["ts", "tsx", "typescript"] },
  { label: "JavaScript", icon: devicon("javascript"), aliases: ["js", "mjs", "cjs", "javascript"] },
  { label: "React", icon: devicon("react"), aliases: ["jsx", "tsx"] },
  { label: "JSON", icon: devicon("json", "original"), aliases: ["json"] },
  { label: "Markdown", icon: devicon("markdown"), aliases: ["md", "markdown"] },
  { label: "HTML", icon: devicon("html5"), aliases: ["html", "htm"] },
  { label: "CSS", icon: devicon("css3"), aliases: ["css"] },
  { label: "Sass", icon: devicon("sass"), aliases: ["scss", "sass"] },
  { label: "Less", icon: devicon("less"), aliases: ["less"] },
  { label: "Tailwind", icon: devicon("tailwindcss"), aliases: ["tailwind", "tw"] },
  { label: "Python", icon: devicon("python"), aliases: ["py", "python"] },
  { label: "Ruby", icon: devicon("ruby"), aliases: ["rb", "ruby"] },
  { label: "PHP", icon: devicon("php"), aliases: ["php"] },
  { label: "Go", icon: devicon("go"), aliases: ["go", "golang"] },
  { label: "Rust", icon: devicon("rust", "plain"), aliases: ["rs", "rust"] },
  { label: "Java", icon: devicon("java"), aliases: ["java"] },
  { label: "Kotlin", icon: devicon("kotlin"), aliases: ["kt", "kts", "kotlin"] },
  { label: "Swift", icon: devicon("swift"), aliases: ["swift"] },
  { label: "C", icon: devicon("c"), aliases: ["c"] },
  { label: "C++", icon: devicon("cplusplus"), aliases: ["cc", "cpp", "cxx"] },
  { label: "C#", icon: devicon("csharp"), aliases: ["cs", "csharp"] },
  { label: "Bash", icon: devicon("bash"), aliases: ["sh", "bash", "zsh"] },
  { label: "YAML", icon: devicon("yaml"), aliases: ["yaml", "yml"] },
  { label: "Docker", icon: devicon("docker"), aliases: ["dockerfile", "docker"] },
  { label: "SQL", icon: devicon("mysql"), aliases: ["sql", "mysql"] },
  { label: "Plain Text", aliases: ["txt", "text", "plain", "plaintext"] },
];

const aliasMap = new Map<string, LanguageDefinition>();
languageDefinitions.forEach((definition) => {
  definition.aliases.forEach((alias) => aliasMap.set(alias, definition));
});

const formatFallbackLabel = (extension?: string) => {
  if (!extension) return "File";
  return extension.length <= 4 ? extension.toUpperCase() : extension;
};

export const getLanguageMeta = (file: Pick<TextFile, "name" | "type">): LanguageMeta => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const mimeTail = file.type?.split("/").pop()?.toLowerCase();
  const candidates = [extension, mimeTail].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const match = aliasMap.get(candidate);
    if (match) {
      return {
        label: match.label,
        icon: match.icon ?? "",
      };
    }
  }

  return {
    label: formatFallbackLabel(extension),
    icon: "",
  };
};

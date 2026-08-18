type Language = "js" | "ts";
type Framework = "vite" | "next";
type Database = "mongo" | "postgres";

export function legacyBranchFor(selection: {
  language: Language;
  framework?: Framework;
  database?: Database;
}): string {
  return [selection.language, selection.framework, selection.database]
    .filter(Boolean)
    .join("-");
}

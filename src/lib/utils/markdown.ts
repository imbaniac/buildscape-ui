import YAML from "yaml";

export interface FrontmatterResult {
  frontmatter: any;
  content: string;
}

/**
 * Parses markdown frontmatter and content, handling Unicode normalization
 * and character sanitization for mobile Safari compatibility
 */
export function parseFrontmatterAndContent(raw: string): FrontmatterResult {
  // Normalize Unicode characters to handle encoding issues on mobile Safari
  const normalizedRaw = raw.normalize("NFC");

  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m.exec(normalizedRaw);
  if (match) {
    try {
      // Replace problematic Unicode characters before parsing YAML
      const cleanedYaml = match[1]
        .replace(/[\u2018\u2019]/g, "'") // Smart quotes to regular quotes
        .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
        .replace(/[\u2013\u2014]/g, "-") // En/em dashes to regular dash
        .replace(/[\u2026]/g, "...") // Ellipsis
        .replace(/[\uFFFD]/g, ""); // Remove replacement character

      const frontmatter = YAML.parse(cleanedYaml);
      const content = match[2].trim();
      return { frontmatter, content };
    } catch (error) {
      console.error("YAML parsing error:", error);
      // Return empty frontmatter on parse error
      return { frontmatter: {}, content: normalizedRaw.trim() };
    }
  }
  return { frontmatter: {}, content: normalizedRaw.trim() };
}

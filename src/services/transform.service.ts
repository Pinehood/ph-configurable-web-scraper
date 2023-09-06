import { ContentExtractor, ScraperConfig } from "@/common/types";

export class TransformService {
  static link(link: string, config: ScraperConfig): string {
    try {
      let finalLink = link;
      if (!finalLink.startsWith("http")) {
        if (!finalLink.startsWith("/")) {
          finalLink = `${config.base}/${link}`;
        } else {
          finalLink = `${config.base}${link}`;
        }
      }
      return finalLink;
    } catch {
      return null;
    }
  }

  static content(value: string, extractor: ContentExtractor): string {
    try {
      let finalValue = value;
      if (extractor.transfomers) {
        extractor.transfomers.forEach((transformer) => {
          if (transformer.type == "replace") {
            finalValue = finalValue.replace(
              new RegExp(transformer.what, "g"),
              transformer.with,
            );
          } else if (transformer.type == "substring") {
            finalValue = finalValue.substring(transformer.from, transformer.to);
          } else if (transformer.type == "split") {
            finalValue = finalValue.split(transformer.value)[transformer.index];
          } else if (transformer.type == "trim") {
            finalValue = finalValue.trim();
          } else if (transformer.type == "uppercase") {
            finalValue = finalValue.toUpperCase();
          } else if (transformer.type == "lowercase") {
            finalValue = finalValue.toLowerCase();
          } else if (transformer.type == "slice") {
            finalValue = finalValue.slice(transformer.from, transformer.to);
          } else if (transformer.type == "padEnd") {
            finalValue = finalValue.padEnd(
              transformer.index,
              transformer.value,
            );
          } else if (transformer.type == "padStart") {
            finalValue = finalValue.padStart(
              transformer.index,
              transformer.value,
            );
          }
        });
      }
      return finalValue;
    } catch {
      return null;
    }
  }
}

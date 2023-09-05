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
              new RegExp(transformer.valueOne as string, "g"),
              transformer.valueTwo as string,
            );
          } else if (transformer.type == "substring") {
            finalValue = finalValue.substring(
              transformer.valueOne as number,
              transformer.valueTwo as number,
            );
          } else if (transformer.type == "split") {
            finalValue = finalValue.split(transformer.valueOne as string)[
              transformer.valueTwo as number
            ];
          } else if (transformer.type == "trim") {
            finalValue = finalValue.trim();
          } else if (transformer.type == "uppercase") {
            finalValue = finalValue.toUpperCase();
          } else if (transformer.type == "lowercase") {
            finalValue = finalValue.toLowerCase();
          } else if (transformer.type == "slice") {
            finalValue = finalValue.slice(
              transformer.valueOne as number,
              transformer.valueTwo as number,
            );
          } else if (transformer.type == "padEnd") {
            finalValue = finalValue.padEnd(
              transformer.valueOne as number,
              transformer.valueTwo as string,
            );
          } else if (transformer.type == "padStart") {
            finalValue = finalValue.padStart(
              transformer.valueOne as number,
              transformer.valueTwo as string,
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

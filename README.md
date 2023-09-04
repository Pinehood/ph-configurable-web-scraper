# Installation

## Prerequisites

- [Node.js](https://nodejs.org/en) (>= 18.10.0)

## Setup

- Run `npm install`
- Run `npm run build`

## Launch

- Run `npm start`

# Example

A simple TypeScript configuration object to scrape articles from Dnevno.hr news portal:

```typescript
const DnevnoConfig: ScraperConfig = {
  name: "Dnevno.hr News Portal",
  base: "https://www.dnevno.hr",
  favicon: "https://dnevno.hr/favicon.ico",
  roots: [
    "https://www.dnevno.hr/category/vijesti",
    "https://www.dnevno.hr/category/sport",
  ],
  links: {
    fetching: {
      method: "GET",
    },
    selector: "article.post a",
    type: "html",
  },
  remove: [
    "img",
    "iframe",
    "div.wpipa-container",
    "div.lwdgt-container",
    "p.lwdgt-logo",
    "center",
    "blockquote",
    "figure",
    "figcaption",
  ],
  scrape: [
    { property: "title", selector: "h1" },
    { property: "lead", selector: "a.title" },
    { property: "time", selector: "time.date", take: "first", type: "text" },
    {
      property: "author",
      selector: "span.author",
      take: "first",
    },
    {
      remove: [
        "div.img-holder",
        "div.heading",
        "h1",
        "style",
        "div.info",
        "div.info-holder",
      ],
      property: "content",
      selector: "section.description",
      type: "html",
    },
  ],
};
```

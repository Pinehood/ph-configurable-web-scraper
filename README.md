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
    {
      property: "time",
      selector: "time.date",
      take: "first",
      type: "text",
      transfomers: [
        {
          type: "split",
          value: ",",
          index: 1,
        },
        {
          type: "trim",
        },
      ],
    },
    {
      property: "author",
      selector: "span.author",
      take: "first",
      transformers: [
        {
          type: "split",
          value: "Autor:",
          index: 1,
        },
        {
          type: "trim",
        },
      ],
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
  submit: {
    type: "request",
    url: "https://my-upload-endpoint.whatever.com/api/upload",
    method: "POST",
    headers: {
      "X-Whatever-Header": "test123",
    },
  },
};
```

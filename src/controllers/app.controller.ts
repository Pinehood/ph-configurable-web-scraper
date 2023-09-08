import { Controller, Get, Render } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";

@Controller()
export class AppController {
  @Get()
  @Render("index")
  index() {
    return {};
  }

  @Get("/create")
  @Render("create")
  create() {
    return {
      options: Object.keys(CronExpression).map((k) => {
        return `
          <option value="${CronExpression[k]}">
            ${k.replace(/\_/g, " ")}
          </option>
        `;
      }),
    };
  }

  @Get("/jobs")
  @Render("jobs")
  jobs() {
    return {};
  }

  @Get("/scrapers")
  @Render("scrapers")
  scrapers() {
    return {};
  }
}

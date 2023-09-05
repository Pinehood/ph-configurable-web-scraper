import { Controller, Get, Render } from "@nestjs/common";

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
    return {};
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

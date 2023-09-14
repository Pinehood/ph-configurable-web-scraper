import { Controller, Delete, Get, Post } from "@nestjs/common";

@Controller("/api")
export class ApiController {
  @Get("job/get")
  getJobs() {
    return {};
  }

  @Delete("job/delete")
  deleteJob() {
    return {};
  }

  @Get("scraper/get")
  getScrapers() {
    return {};
  }

  @Post("scraper/create")
  createScraper() {
    return {};
  }

  @Delete("scraper/delete")
  deleteScraper() {
    return {};
  }
}

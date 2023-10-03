import { AppRoutes, HISTORY, JOB, OPTION, SCRAPER, Views } from "@/common";
import { StorageService } from "@/services";
import { Controller, Get, Render } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";

@Controller(AppRoutes.BASE)
export class AppController {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Get(["", AppRoutes.HOME])
  @Render(Views.HOME)
  index() {
    return {};
  }

  @Get(AppRoutes.CREATE)
  @Render(Views.CREATE)
  create() {
    return {
      options: Object.keys(CronExpression)
        .map((k) => OPTION(k.replace(/\_/g, " "), CronExpression[k]))
        .join(" "),
    };
  }

  @Get(AppRoutes.JOBS)
  @Render(Views.JOBS)
  jobs() {
    const data = StorageService.data();
    return {
      rows: data.jobs
        .map((j, i) => {
          const job = this.schedulerRegistry.doesExist("cron", j.name)
            ? this.schedulerRegistry.getCronJob(j.name)
            : null;
          const status = job
            ? job.running == true
              ? "running"
              : "stopped"
            : "unknown";
          return JOB(j, i, status);
        })
        .join(" "),
    };
  }

  @Get(AppRoutes.SCRAPERS)
  @Render(Views.SCRAPERS)
  scrapers() {
    const data = StorageService.data();
    return {
      rows: data.scrapers
        .map((s, i) => {
          const expression = data.jobs.find(
            (j) => j.scraper == s.name,
          ).expression;
          let schedule = "unknown";
          Object.keys(CronExpression).forEach((k) => {
            if (CronExpression[k] == expression) {
              schedule = k.replace(/_/g, " ").toLowerCase();
            }
          });
          return SCRAPER(s, i, schedule);
        })
        .join(" "),
    };
  }

  @Get(AppRoutes.HISTORY)
  @Render(Views.HISTORY)
  history() {
    const data = StorageService.histories();
    return {
      rows: data.map((h, i) => HISTORY(h, i)).join(" "),
    };
  }
}

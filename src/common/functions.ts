import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJobMeta, DataStorage, ScraperConfig } from "@/common/types";

export function getJobStatus(sr: SchedulerRegistry, j: CronJobMeta): string {
  const job = sr.doesExist("cron", j.name) ? sr.getCronJob(j.name) : null;
  const status = job
    ? job.running == true
      ? "running"
      : "stopped"
    : "unknown";
  return status;
}

export function getJobSchedule(d: DataStorage, s: ScraperConfig): string {
  const expression = d.jobs.find((j) => j.scraper == s.name).expression;
  let schedule = "unknown";
  Object.keys(CronExpression).forEach((k) => {
    if (CronExpression[k] == expression) {
      schedule = k.replace(/_/g, " ").toLowerCase();
    }
  });
  return schedule;
}

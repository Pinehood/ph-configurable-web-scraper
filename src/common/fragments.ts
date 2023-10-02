import { CronJobMeta, ScraperConfig, ScraperHistory } from "./types";

export const OPTION = (key: string, value: string) => `
    <option value="${value}">
       ${key}
    </option>
`;

export const JOB = (job: CronJobMeta, index: number, status: string) => `
<tr>
  <th scope="row">${index + 1}</th>
  <td>${job.name}</td>
  <td>${job.expression}</td>
  <td>${job.scraper}</td>
  <td>${status}</td>
  <td>
    <button
      type="button"
      class="btn btn-primary"
      onclick="startJob('${job.name}')">
        Start
    </button>
    <span>&nbsp;</span>
    <button 
      type="button"
      class="btn btn-danger"
      onclick="stopJob('${job.name}')">
        Stop
    </button>
  </td>
</tr>
`;

export const SCRAPER = (
  scraper: ScraperConfig,
  index: number,
  schedule: string,
) => `
<tr>
  <th scope="row">${index + 1}</th>
  <td>${scraper.name}</td>
  <td>${scraper.base}</td>
  <td>${schedule}</td>
  <td>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#modal"
      onclick="getConfig('${scraper.name}')">
        Config
    </button>
    <span>&nbsp;</span>
    <button 
      type="button"
      class="btn btn-danger"
      onclick="deleteScraper('${scraper.name}')">
        Delete
    </button>
  </td>
</tr>
`;

export const HISTORY = (history: ScraperHistory, index: number) => `
<tr>
    <th scope="row">${index + 1}</th>
    <td>${history.scraper}</td>
    <td>${history.date.toUTCString()}</td>
    <td>${history.amount}</td>
    <td>${history.duration}s</td>
    <td>${history.success}</td>
    <td>${history.submitted}</td>
</tr>
`;

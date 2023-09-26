/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [], "controllers": [[import("./controllers/api.controller"), { "ApiController": { "getJobs": {}, "deleteJob": {}, "getScrapers": {}, "createScraper": {}, "deleteScraper": {} } }], [import("./controllers/app.controller"), { "AppController": { "index": {}, "create": {}, "jobs": {}, "scrapers": {} } }]] } };
};
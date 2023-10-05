const DEFAULT_CONFIG = {
  name: "",
  base: "",
  favicon: "",
  roots: [],
  links: {
    fetching: {
      method: "",
      headers: {},
      body: {},
    },
    selector: "",
    type: "",
  },
  remove: [],
  scrape: [
    {
      remove: [],
      property: "",
      selector: "",
      take: "",
      type: "",
      transfomers: [],
    },
  ],
  submit: {
    type: "",
    url: "",
    method: "",
    headers: {},
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const json = document.getElementById("json");
  const cron = document.getElementById("cron");
  json.value = JSON.stringify(DEFAULT_CONFIG, undefined, 4);
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
      const body = JSON.parse(json.value);
      body.cron = cron.value;
      const response = await fetch("/api/scraper", {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Secret-Key": localStorage.getItem("sk"),
        },
      });
      if (response && response.status == 201) {
        showHideAlert("alert-success");
        json.value = JSON.stringify(DEFAULT_CONFIG, undefined, 4);
      } else {
        showHideAlert("alert-danger");
      }
    } catch {
      showHideAlert("alert-danger");
    }
  });
});

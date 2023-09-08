document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const json = document.getElementById("json");
  const cron = document.getElementById("cron");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(json.value);
    console.log(cron.value);
  });
});

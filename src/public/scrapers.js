async function getConfig(name) {
  const response = await fetch(`/api/scraper/${encodeURIComponent(name)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (response && response.status == 200) {
    document.getElementById("json").value = JSON.stringify(
      await response.json(),
      undefined,
      4,
    );
  }
}

async function deleteScraper(name) {
  const response = await fetch(`/api/scraper/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
  if (response && response.status == 200) {
    showHideAlert("alert-success");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } else {
    showHideAlert("alert-danger");
  }
}

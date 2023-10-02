async function startJob(name) {
  const response = await fetch(`/api/job/${encodeURIComponent(name)}`, {
    method: "PUT",
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

async function stopJob(name) {
  const response = await fetch(`/api/job/${encodeURIComponent(name)}`, {
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

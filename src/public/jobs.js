async function startJob(name) {
  const response = await fetch(`/api/job/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: {
      "X-Secret-Key": localStorage.getItem("sk"),
    },
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
    headers: {
      "X-Secret-Key": localStorage.getItem("sk"),
    },
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

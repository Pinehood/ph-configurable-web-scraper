async function clearHistory() {
  const response = await fetch("/api/history", {
    method: "DELETE",
    headers: {
      "X-Secret-Key": localStorage.getItem("sk"),
    },
  });
  if (response && response.status == 200) {
    window.location.reload();
  }
}

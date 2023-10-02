async function clearHistory() {
  const response = await fetch("/api/history", {
    method: "DELETE",
  });
  if (response && response.status == 200) {
    window.location.reload();
  }
}

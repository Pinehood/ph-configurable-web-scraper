// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementsByClassName("container")
//     .item(0)
//     .childNodes.item(2)
//     .remove();
// });

function showHideAlert(id) {
  const alert = document.getElementById(id);
  if (alert) {
    alert.hidden = false;
    setTimeout(() => {
      alert.hidden = true;
    }, 1500);
  }
}

function setKey() {
  const element = document.getElementById("secret_key");
  if (element) {
    localStorage.removeItem("sk");
    localStorage.setItem("sk", element.value);
    showHideAlert("alert-success");
    element.value = "";
  }
}

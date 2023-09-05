document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("configForm");
  const addRemoveItemButton = document.getElementById("addRemoveItem");
  const removeList = document.getElementById("removeList");
  let itemCount = 0;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
  addRemoveItemButton.addEventListener("click", function () {
    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.className = "form-control mb-2";
    itemInput.name = `remove[${itemCount}]`;
    itemInput.placeholder = "Item";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-danger";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
      itemInput.remove();
      removeButton.remove();
      listItem.remove();
    });

    const listItem = document.createElement("li");
    listItem.appendChild(itemInput);
    listItem.appendChild(removeButton);

    removeList.appendChild(listItem);
    itemCount++;
  });
});

const search = () => {
  const searchbox = document.getElementById("search-item").value.toUpperCase();
  const cards = document.querySelectorAll(".card");
  const deleteButtons = document.querySelectorAll(".delete-btn");
  let visibleCount = 0;

  for (let i = 0; i < cards.length; i++) {
    let textValue = cards[i].textContent || cards[i].innerText;
    let deleteButton = deleteButtons[i];

    if (textValue.toUpperCase().indexOf(searchbox) > -1) {
      cards[i].parentElement.style.display = "block"; // Show the card's parent element
      deleteButton.style.display = "flex"; // Show the delete button
      visibleCount++;
    } else {
      cards[i].parentElement.style.display = "none"; // Hide the card's parent element
      deleteButton.style.display = "none"; // Hide the delete button
    }
  }
};

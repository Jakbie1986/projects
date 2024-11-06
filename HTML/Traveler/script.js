const dropListItems = document.querySelectorAll('.extra_box');
const plusButtons = document.querySelectorAll('.plus_icon');
console.log(dropListItems);

const showExtraBox = (e) => {
    console.log(e.target.parentElement.nextElementSibling);
    const dropListItem = e.target.parentElement.nextElementSibling;
    dropListItem.classList.toggle('nodisplay')
}

plusButtons.forEach(plusButton => plusButton.addEventListener('click', showExtraBox));



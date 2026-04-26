// script.js

let adventureList = [];
let adventures = document.getElementsByClassName('adventure');
for (let i = 0; i < adventures.length; i++) {
    let adventureName = adventures[i].innerHTML;
    adventureList.push(adventureName);
}

let searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keyup', function (event) {
    let text = searchBar.value;
    for (let i = 0; i < adventures.length; i++) {
        if (adventureList[i].indexOf(text) < 0) {
            adventures[i].style.display = 'None';
        } else {
            adventures[i].style.display = 'Block';
        }
    }
});


// main.js

let checkbox = document.getElementById('petCheckbox');
let selectionDiv = document.getElementById('petSelection');
checkbox.addEventListener('change', function (event) {
    if (checkbox.checked == true) {
        selectionDiv.style.display = 'Block';
    } else {
        selectionDiv.style.display = 'None';
    }
});

let saveForm = document.getElementById('saveForm');
saveForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let nameText = saveForm.elements[0].value;
    let addressText = saveForm.elements[1].value;
    let ageText = saveForm.elements[2].value;
    let doesHavePets = saveForm.elements[3].checked;
    let petText = 'No pets';

    if (nameText == '') {
        alert('Please enter a name');
        return;
    }
    if (addressText == '') {
        alert('Please enter an address');
        return;
    }
    if (ageText == '') {
        alert('Please enter an age');
        return;
    }
    if (doesHavePets) {
        petText = saveForm.elements[4].value;
    }
    if (petText == 'Dog') {
        alert('Sorry, our dog capacity is full :(');
        return;
    }

    const data = {
        name: saveForm.elements[0].value,
        address: saveForm.elements[1].value,
        age: saveForm.elements[2].value,
        pet: saveForm.elements[4].value
    };
    
    // Save to localStorage. Redirect to table page.
    localStorage.setItem('formData', JSON.stringify(data));
    window.location.href = 'results.html';
});

// results.js

const storedData = JSON.parse(localStorage.getItem('formData'));

if (storedData) {
    const tableBody = document.getElementById('tableBody');
    const row = `<tr><td>${storedData.name}</td><td>${storedData.address}</td><td>${storedData.age}</td><td>${storedData.pet}</td></tr>`;
    tableBody.innerHTML = row;
}

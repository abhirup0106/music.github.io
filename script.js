document.addEventListener('DOMContentLoaded', function() {
    loadIndex();
    loadTheme(); // Load saved theme on page load
});

const form = document.getElementById('indexForm');
const tableBody = document.getElementById('indexBody');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const editForm = document.getElementById('editForm');
const saveEditBtn = document.getElementById('saveEditBtn');
const themeToggle = document.getElementById('themeToggle');
let editIndex = null;

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleButton(newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateToggleButton(savedTheme);
}

function updateToggleButton(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const pageNumber = document.getElementById('pageNumber').value;
    addEntry(description, pageNumber);
    form.reset();
});

// Edit modal save
saveEditBtn.addEventListener('click', function() {
    const description = document.getElementById('editDescription').value;
    const pageNumber = document.getElementById('editPageNumber').value;
    if (editIndex !== null) {
        updateEntry(editIndex, description, pageNumber);
        editModal.hide();
        editIndex = null;
    }
});

function addEntry(description, pageNumber, slno = null) {
    const entries = getEntries();
    if (!slno) {
        slno = entries.length + 1;
    }
    const entry = { slno, description, pageNumber };
    entries.push(entry);
    saveEntries(entries);
    renderTable();
}

function editEntry(index) {
    const entries = getEntries();
    const entry = entries[index];
    document.getElementById('editDescription').value = entry.description;
    document.getElementById('editPageNumber').value = entry.pageNumber;
    editIndex = index;
    editModal.show();
}

function updateEntry(index, description, pageNumber) {
    const entries = getEntries();
    entries[index].description = description;
    entries[index].pageNumber = pageNumber;
    saveEntries(entries);
    renderTable();
}

function deleteEntry(index) {
    const entries = getEntries();
    entries.splice(index, 1);
    // Reassign SLNO after deletion
    entries.forEach((entry, i) => entry.slno = i + 1);
    saveEntries(entries);
    renderTable();
}

function getEntries() {
    return JSON.parse(localStorage.getItem('indexEntries')) || [];
}

function saveEntries(entries) {
    localStorage.setItem('indexEntries', JSON.stringify(entries));
}

function renderTable() {
    tableBody.innerHTML = '';
    const entries = getEntries();
    entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.slno}</td>
            <td>${entry.description}</td>
            <td>${entry.pageNumber}</td>
            <td>
                <button class="btn btn-primary btn-sm me-2" onclick="editEntry(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadIndex() {
    renderTable();
}
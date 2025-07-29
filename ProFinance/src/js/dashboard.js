//button for log out app

const $btnLogOut = document.getElementById('btn-logout');

$btnLogOut.addEventListener('click', () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
})

import { createNewMovement, deleteMovement, getMovement, getMovements, updateMovement } from "../services/dashboardService";
import {fetchData} from "../js/reports"

// Endpoint for categories
const endPointCategories = "http://localhost:3001/categories"
// Endpoint for movements
const endPointMovements = "http://localhost:3001/movements";

// DOM elements for form
const $formMovements = document.getElementById("form-movements");
const $movementsBody = document.getElementById("movements-body");

// DOM elements for filters
const $filterType = document.getElementById("filter-type");
const $filterCategory = document.getElementById("filter-category");
const $btnCleanFilter = document.getElementById("btn-clean-filter");

// NEW: DOM element for sorting
const $sortMovements = document.getElementById("sort-movements");

let selectCategories = $formMovements.category
let editingMovementId = null; // Variable to know if we are editing
let allMovements = []; // Variable to store all movements without filters

document.addEventListener("DOMContentLoaded", function () {
    showCategories();
    showMovements();
    setupFilterEventListeners();
})

// Setup event listeners for all filters and sorting
function setupFilterEventListeners() {
    $filterType.addEventListener("change", applyFiltersAndSort);
    $filterCategory.addEventListener("change", applyFiltersAndSort);
    $sortMovements.addEventListener("change", applyFiltersAndSort);
 
    $btnCleanFilter.addEventListener("click", cleanFilters);
}

// NEW: Apply both filters and sorting to movements
function applyFiltersAndSort() {
    let filteredMovements = [...allMovements];

    // Apply filters first
    filteredMovements = applyFilters(filteredMovements);

    // Then apply sorting
    filteredMovements = applySorting(filteredMovements);

    // Render final result
    renderMovements(filteredMovements);
}

// Apply all active filters to movements (refactored to return filtered array)
function applyFilters(movements = allMovements) {
    let filteredMovements = [...movements];

    // Filter by type
    if ($filterType.value) {
        filteredMovements = filteredMovements.filter(movement =>
            movement.type === $filterType.value
        );
    }

    // Filter by category
    if ($filterCategory.value) {
        filteredMovements = filteredMovements.filter(movement =>
            movement.categoryId == $filterCategory.value || movement.category.id == $filterCategory.value
        );
    }

   

   
    return filteredMovements;
}

// NEW: Apply sorting to movements
function applySorting(movements) {
    const sortValue = $sortMovements.value;
    
    if (!sortValue) return movements;

    const sortedMovements = [...movements];

    switch (sortValue) {
        case 'date-desc': // Most Recent
            return sortedMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        case 'date-asc': // Least Recent
            return sortedMovements.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        case 'amount-desc': // Highest Amount
            return sortedMovements.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        
        case 'amount-asc': // Lowest Amount
            return sortedMovements.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
        
        case 'description-asc': // A-Z
            return sortedMovements.sort((a, b) => a.description.toLowerCase().localeCompare(b.description.toLowerCase()));
        
        case 'description-desc': // Z-A
            return sortedMovements.sort((a, b) => b.description.toLowerCase().localeCompare(a.description.toLowerCase()));
        
        default:
            return sortedMovements;
    }
}

// Clean all filters and sorting, show all movements
function cleanFilters() {
    $filterType.value = "";
    $filterCategory.value = "";
    $sortMovements.value = ""; // NEW: Reset sorting
    
    // Show all movements without any filters or sorting
    renderMovements(allMovements);
}


// Form submit handler for creating new movement or editing existing
$formMovements.addEventListener("submit", async function (event) {
    event.preventDefault();

    const movementData = {
        type: $formMovements.type.value,
        description: $formMovements.description.value,
        amount: $formMovements.amount.value,
        date: $formMovements.date.value,
        categoryId: $formMovements.category.value
    }

    if (editingMovementId) {
        let response = await updateMovement(editingMovementId, movementData);
        if (response) {
            alert("Movement updated successfully");
            showMovements();
        } else {
            console.error("Error updating movement");
        }
    } else {
        let response = await createNewMovement(movementData);
        if (response) {
            alert("Movement created successfully")
            showMovements();
        } else {
            console.error("Error creating movement")
        }
    }

    $formMovements.reset();
    editingMovementId = null;
    document.querySelector('button[type="submit"]').textContent = "Save Movement";
});

// Event delegation for edit and delete buttons
$movementsBody.addEventListener("click", async function (event) {
    if (event.target.classList.contains("edit-btn")) {
        const movementId = event.target.dataset.id;
        editMovement(movementId);
    }

    if (event.target.classList.contains("delete-btn")) {
        const movementId = event.target.dataset.id;
        if (confirm("Are you sure you want to delete this movement?")) {
            let response = await deleteMovement(movementId);
            if (response) {
                alert("Movement deleted successfully");
                showMovements();
            } else {
                console.error("Error deleting movement");
            }
        }
    }
});

// Show categories in form select and filter select
async function showCategories() {
    selectCategories.innerHTML = ""
    let response = await fetch(endPointCategories)
    let data = await response.json()

    if (data.length > 0) {
        selectCategories.innerHTML += `
            <option value="">-- Select category --</option>
        `

        // Also populate the category filter
        $filterCategory.innerHTML = `<option value="">Category</option>`;
    }

    data.forEach(category => {
        selectCategories.innerHTML += `
            <option value="${category.id}">${category.name}</option>
        `

        // Add categories to filter
        $filterCategory.innerHTML += `
            <option value="${category.id}">${category.name}</option>
        `
    });
}

// Show movements - fetch and store all movements
export async function showMovements() {
    let movements = await getMovements()
    allMovements = movements; // Store all movements for filtering

    // Apply current filters and sorting when loading movements
    applyFiltersAndSort();
}

// Render movements in table 
function renderMovements(movements) {
    $movementsBody.innerHTML = ""

    if (movements.length === 0) {
        $movementsBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">No movements found</td>
            </tr>
        `;
        return;
    }

    for (const movement of movements) {
        $movementsBody.innerHTML += `
            <tr>
             <td>${movement.description}</td>
             <td>$${parseFloat(movement.amount).toFixed(2)}</td>
                <td>${movement.type}</td>
                <td>${movement.category?.name || 'N/A'}</td>
                <td>${new Date(movement.date).toLocaleDateString()}</td>
                <td>
                    <button class="edit-btn" data-id="${movement.id}">Edit</button>
                    <button class="delete-btn" data-id="${movement.id}">Delete</button>
                </td>
            </tr>
        `
    }
}

// Edit movement - load data into form for editing
async function editMovement(id) {
    let movement = await getMovement(id);

    // Load movement data into form
    $formMovements.type.value = movement.type;
    $formMovements.description.value = movement.description;
    $formMovements.amount.value = movement.amount;
    $formMovements.date.value = movement.date;
    $formMovements.category.value = movement.categoryId;

    // Change status to editing mode
    editingMovementId = id;
    document.querySelector('button[type="submit"]').textContent = "Update Movement";
}


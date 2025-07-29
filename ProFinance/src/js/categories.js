
import { deleteCategory, saveCategorie, updateCategory, } from "../services/categoriesService";

//button for log out app

const $btnLogOut = document.getElementById('btn-logout');

$btnLogOut.addEventListener('click', () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
})


// categories endpoint 
const endPoint = "http://localhost:3001/categories";
// movements endpoint for cascade delete
const movementsEndpoint = "http://localhost:3001/movements";

//button for save categories
const btnCategorie = document.getElementById("btn-categorie");
const inputText = document.getElementById("categorie");

//list of categories
const listCategories = document.getElementById("listCategories");

btnCategorie.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

    const categoryName = inputText.value.trim();
    if (!categoryName) {
        alert("Please enter a category name");
        return;
    }

    const newCategory = {
        name: categoryName
    }
    
    // Save category and reload list automatically
    await saveCategorie(newCategory);
    inputText.value = ""; // Clear input after saving
    loadCategories(); // Reload categories to show the new one
});

//load the categories when the page loads
export async function loadCategories() {
    try {
        const response = await fetch(endPoint);
        const data = await response.json();
        
        listCategories.innerHTML = ""; // Clear previous list
        
        if (data.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "No categories found";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.color = "#6b7280";
            emptyMessage.style.fontStyle = "italic";
            listCategories.appendChild(emptyMessage);
            return;
        }
        
        data.forEach((category, index) => {
            const listItem = document.createElement("li");
            listItem.className = "category-item";
            
            // Create category content container
            const categoryContent = document.createElement("div");
            categoryContent.className = "category-content";
            
            // Category name
            const categoryName = document.createElement("span");
            categoryName.textContent = category.name;
            categoryName.className = "category-name";
            
            // Buttons container
            const buttonsContainer = document.createElement("div");
            buttonsContainer.className = "category-buttons";
            
            // Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            // Usar index si no hay ID, o category.id si existe
            const categoryId = category.id || index;
            editButton.onclick = () => editCategory(categoryId, category.name);
            
            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.onclick = () => confirmDeleteCategory(categoryId, category.name);
            
            // Append elements
            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);
            
            categoryContent.appendChild(categoryName);
            categoryContent.appendChild(buttonsContainer);
            
            listItem.appendChild(categoryContent);
            listCategories.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        listCategories.innerHTML = "<li style='color: red; text-align: center;'>Error loading categories</li>";
    }
}

//load categories automatically when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadCategories(); // load categories when the page is ready
});

// Function to edit category (prompts for new name)
async function editCategory(categoryId, currentName) {
    const newName = prompt(`Edit category name:`, currentName);
    
    if (newName === null) return; // User cancelled
    
    if (newName.trim() === "") {
        alert("Category name cannot be empty");
        return;
    }
    
    if (newName.trim() === currentName) {
        alert("No changes made");
        return;
    }
    
    // Update category and reload list automatically
    await updateCategory(categoryId, newName.trim());
    loadCategories(); // Reload categories to show the updated one
}

// Function to confirm and delete category with cascade delete warning
async function confirmDeleteCategory(categoryId, categoryName) {
    try {
        // Check how many operations will be deleted
        const operationsResponse = await fetch(`${movementsEndpoint}?categoryId=${categoryId}`);
        const operationsToDelete = await operationsResponse.json();
        
        let confirmMessage = `Are you sure you want to delete the category "${categoryName}"?`;
        
        if (operationsToDelete.length > 0) {
            confirmMessage += `\n\n⚠️ WARNING: This will also permanently delete ${operationsToDelete.length} operation(s) associated with this category.`;
            confirmMessage += `\n\nThis action cannot be undone.`;
        }
        
        const confirmDelete = confirm(confirmMessage);
        
        if (confirmDelete) {
            const success = await deleteCategory(categoryId, categoryName);
            if (success) {
                loadCategories(); // Reload categories
                
                // Try to update movements list if the function exists (if user is on movements page)
                if (typeof window.showMovements === 'function') {
                    window.showMovements();
                }
                
                // Alternative: trigger a custom event to notify other pages
                window.dispatchEvent(new CustomEvent('categoryDeleted', { 
                    detail: { categoryId, categoryName, deletedOperations: operationsToDelete.length } 
                }));
            }
        }
    } catch (error) {
        console.error('Error in confirmDeleteCategory:', error);
        alert('Error checking operations for this category. Please try again.');
    }
}
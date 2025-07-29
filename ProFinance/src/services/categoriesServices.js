import { loadCategories } from "../js/categories";

// categories endpoint 
const endPoint = "http://localhost:3000/categories";
// movements endpoint for cascade operations
const movementsEndpoint = "http://localhost:3000/movements";

// saved categories function
export async function saveCategorie(newCategory) {
    try {
        let response = await fetch(endPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCategory)
        });

        if(response.ok){
            alert("Category created successfully!");
        } else {
            alert("Error creating category");
        }
    } catch (error) {
        console.error('Error saving category:', error);
        alert("Error saving category");
    }
}

// Update category function
export async function updateCategory(categoryId, newName) {
    try {
        let response = await fetch(`${endPoint}/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newName })
        });

        if(response.ok){
            alert("Category updated successfully!");
        } else {
            alert("Error updating category");
        }
    } catch (error) {
        console.error('Error updating category:', error);
        alert("Error updating category");
    }
}

// Helper function to delete all operations by category ID
async function deleteOperationsByCategory(categoryId) {
    try {
        // Get all movements for this category
        const operationsResponse = await fetch(`${movementsEndpoint}?categoryId=${categoryId}`);
        const operations = await operationsResponse.json();
        
        // Delete each operation
        const deletePromises = operations.map(operation => 
            fetch(`${movementsEndpoint}/${operation.id}`, {
                method: 'DELETE'
            })
        );
        
        // Wait for all deletions to complete
        await Promise.all(deletePromises);
        
        return operations.length; // Return number of deleted operations
    } catch (error) {
        console.error('Error deleting operations by category:', error);
        throw new Error('Failed to delete associated operations');
    }
}

// Delete category function with cascade delete (eliminates operations automatically)
export async function deleteCategory(categoryId, categoryName) {
    try {
        // STEP 1: Delete all operations associated with this category
        const deletedOperationsCount = await deleteOperationsByCategory(categoryId);
        
        // STEP 2: Delete the category itself
        let response = await fetch(`${endPoint}/${categoryId}`, {
            method: "DELETE"
        });

        if(response.ok){
            let successMessage = `Category "${categoryName}" deleted successfully!`;
            if (deletedOperationsCount > 0) {
                successMessage += `\n${deletedOperationsCount} associated operation(s) were also deleted.`;
            }
            alert(successMessage);
            return true; // Indicate success
        } else {
            throw new Error('Failed to delete category from server');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        
        // More specific error messages
        if (error.message.includes('operations')) {
            alert("Error deleting associated operations. Category deletion cancelled.");
        } else {
            alert("Error deleting category. Please try again.");
        }
        return false; // Indicate failure
    }
}
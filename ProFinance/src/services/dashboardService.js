import { showMovements } from "../js/dashboard";

//endpoint for movements
const endPointMovements = "http://localhost:3001/movements";

//create a new movement
export async function createNewMovement(newMovement) {
    let response = await fetch(endPointMovements, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newMovement)
    })

    return response.ok

    
}

//get single movement
export async function getMovement(id) {
    let response = await fetch(`${endPointMovements}/${id}?_embed=category`)
    let data = await response.json();
    return data;
}


//get movements
export async function getMovements() {
    let response = await fetch(`${endPointMovements}?_embed=category`)
    let data = await response.json();
    return data;
}

//update movement
export async function updateMovement(id, updatedMovement) {
    let response = await fetch(`${endPointMovements}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedMovement)
    })

    if (response.ok) {
        alert("Movement updated successfully")
        showMovements();
    } else {
        console.error("Error updating movement")
    }
}

//delete movement
export async function deleteMovement(id) {
    if (confirm("Are you sure you want to delete this movement?")) {
        let response = await fetch(`${endPointMovements}/${id}`, {
            method: "DELETE"
        })

        if (response.ok) {
            alert("Movement deleted successfully")
            showMovements();
        } else {
            console.error("Error deleting movement")
        }
    }
}
// guardian.js
// This script checks if a user is logged in by verifying the presence of 'currentUser'
// in localStorage. If not found, it redirects to the index page.
function checkSession() {
    let checkUser = localStorage.getItem('currentUser');

    if (checkUser === null){
        window.location.href = 'index.html';
    }
}

checkSession();
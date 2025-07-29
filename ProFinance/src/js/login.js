//Validate the login form
// get the login form element


const loginForm = document.getElementById('loginForm');

// add an event listener to the form to handle the submit event
// prevent the default form submission

loginForm.addEventListener('submit', (event) => {

    const inputUsername = loginForm.username.value
    const inputPassword = loginForm.password.value;

    login(inputUsername, inputPassword)

    event.preventDefault(); // Prevent the default form submission

})

// fetch the user data from the server using the input username
// check if the user exists
async function login(inputUsername, inputPassword) {
    let response = await fetch(`http://localhost:3001/user?username=${inputUsername}`,)
    let data = await response.json();
    // if user not found, alert the user
    // if user found, check the password
    // if password matches, store the user data in localStorage and redirect to dashboard
    // if password does not match, alert the user
    if (data.length === 0) {
        alert("user not found")
    } else {
        const userFound = data[0]

        if (userFound.password === inputPassword) {
            localStorage.setItem('currentUser', JSON.stringify(userFound));
            window.location.href = './src/views/dashboard.html';
        } else {
            alert("password or username incorrect");
        }
    }

}
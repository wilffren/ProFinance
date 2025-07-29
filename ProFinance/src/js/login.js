
//obtain the form element

const $formLogin = document.querySelector('#formLogin');

//and add an event listener to it
//to prevent the default action of reloading the page
//and to call the login function with the input values

$formLogin.addEventListener("submit", (event) => {
    event.preventDefault();         //don't reload page
    const inputUserName = $formLogin.username.value
    const inputPassword = $formLogin.password.value
    

    login(inputUserName, inputPassword)
})

async function login(inputUserName, inputPassword) {
    let response = await fetch(`http://localhost:3000/users/${inputUserName}`)
    let data = await response.json()

    if (data.lenght === 0) {
        alert("User not found")
    }else{
        data.userfound

        if (data.password === inputPassword) {
            alert("Login successful")
            // Redirect to the main page or perform other actions
            window.location.href = "index.html";
        } else {
            alert("Incorrect password")
        }
    }
}
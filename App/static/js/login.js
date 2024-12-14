checkTokken()
const email = document.getElementById("email")
const password = document.getElementById("password")
const submit = document.getElementById("log-btn")
const error = document.getElementById("error-log")
submit.addEventListener("click", () => {
    if (!email.value && !password.value) checkError("Please fill The form first")
    else if (!email.value) checkError("Please Enter your Email")
    else if (!password.value) checkError("Please Enter the Password")
    else if (!validateEmail(email.value)) checkError("Email is Invalid. Enter the Valide email")
    else {
        checkError("")
        loggingIn()
    }
})


function checkError(value) {
    if (!value) error.classList.add("hidden")
    else error.classList.remove("hidden")
    error.textContent = value
}
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
function loggingIn() {
    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    }).then(res => {
        if (res.status == 302) checkError("Invalid Email or Password")
        else if (res.status == 200) {
            res.json().then(res => {
                window.localStorage.setItem("tokken", res.access_token)
                window.location.href = "/"
            })
        }
    }).catch(err => console.log("Go Back to using Reactjs", err))
}
function checkTokken() {
    const tokken = window.localStorage.getItem("tokken")
    if (!tokken) return;
    fetch('/protected', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${tokken}`,
            "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.status == 300) window.localStorage.removeItem("tokken")
        else if (res.status == 200) window.location.href = "/"
    }
    ).catch(err => console.log("Don't ever do programming in your life", err))
}
checkTokken()
const email = document.getElementById("email")
const password = document.getElementById("password")
const confirmPass = document.getElementById("confirmPass")
const error = document.getElementById("error-log")

const submit = document.getElementById("sign-btn")
submit.addEventListener("click", () => {
    changeError("")
    if (!confirmPass.value && !password.value && !email.value) changeError("Please vill the form")
    else if (!confirmPass.value) changeError("Confirm Password is Required")
    else if (!password.value) changeError("Password is Required")
    else if (!email.value) changeError("Email is Required")
    else if (!validateEmail(email.value)) changeError("Email is Invalid. Please type the valid Email")
    else {
        changeError("")
        signningUp()
    }

})
function changeError(value) {
    if (value) error.classList.remove("hidden")
    else error.classList.add("hidden")
    error.textContent = value
}
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function signningUp() {
    fetch("/resetpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    }).then(res => {
        if (res.status == 202) {
            res.json().then(res => {
                window.localStorage.setItem('tokken', res.access_token)
                window.location.href = "/"
            }
            )
        }
        else if (res.status == 302) {
            changeError("Already have a account")
        }
    }).catch(err => console.log("Just give up coding", err))
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


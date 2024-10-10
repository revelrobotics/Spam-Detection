// auth
const {pathname} = window.location;
if (pathname == "/login" || pathname == "/signup" || pathname == "/forgetpassword"){
    if(window.localStorage.getItem("tokken"))  window.location.href = window.location.origin + "/"
    else{
        document.getElementById("dark-bg")
        document.querySelector("body").style = "overflow: hidden;"
        document.getElementById("loggout-btn").style = "opacity:0;"
    }
}
else{
    document.getElementById("dark-bg").remove()
    if(!window.localStorage.getItem("tokken")){
        window.location.href = window.location.href + "login"
    }
    else{
        
        
    }
}
// Log in forms
if(pathname === '/login'){
const email = document.getElementById("email")
const pass = document.getElementById("password")
const log_btn= document.getElementById("log-btn")

log_btn.addEventListener("click", ()=>{
    const error = document.getElementById("error-log")
    if(!email.value || !pass.value){
        error.classList.remove("hidden")
        error.innerText = "Please provide both email and password"
    }
    else{
        error.classList.add("hidden")
        fetch("/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email : email.value,
                password: pass.value
            })
        }).then(res=> {
            if (res.status == 401){
                error.classList.remove("hidden")
                error.innerText = "Email or Password is Inncorrect"
            }
            else{
                res.json().then(data=>{
                    if(res.status == 200){
                        localStorage.setItem("tokken", data)
                        window.location.href = window.location.origin + "/"
                    }
                }
                )
            }
        })
        
    }
    
})
}
else if(pathname === '/signup'){
    const username = document.getElementById("username")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const error = document.getElementById("error-log")
    const submit_btn = document.getElementById("sign-btn")
    submit_btn.addEventListener("click", ()=> {
    if(!username.value || !email.value || !password.value ) {
            error.classList.remove("hidden")
            error.innerText = "Please provide the Complate info"
        }
    else {
        error.classList.add("hidden")
        fetch("/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username.value,
                email : email.value,
                password: password.value
            })
        }).then(res=> {
            if (res.status == 401){
                error.classList.remove("hidden")
                error.innerText = "Email or Password is Inncorrect"
            }
            else{
                res.json().then(data=>{
                    if(res.status == 200){
                        localStorage.setItem("tokken", data)
                        window.location.href = window.location.origin + "/"
                    }
                }
                )
            }
        })
    }
}
)
}
else if(pathname === '/forgetpassword'){
    const error = document.getElementById("error-log")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const confim_password = document.getElementById("confim-pass")
    const forget_btn = document.getElementById("forget-btn")
    forget_btn.addEventListener("click",()=>{
        if(!email.value || !password.value || !confim_password.value){
            error.classList.remove("hidden")
            error.innerText = "Please provide the Complate info"
        }
        else{
            if(password.value !== confim_password.value){
                error.classList.remove("hidden")
                error.innerText = "Password and Confirm Password isn't same"
            }
            else{
                error.classList.add("hidden")
                fetch("/forgetpassword", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email : email.value,
                        password: password.value
                        
                    })
                }).then(res=> {
                    if (res.status == 401){
                        error.classList.remove("hidden")
                        error.innerText = "Email or Password is Inncorrect"
                    }
                    else{
                        res.json().then(data=>{
                            if(res.status == 200){
                                localStorage.setItem("tokken", data)
                                window.location.href = window.location.origin + "/"
                            }
                        }
                        )
                    }
                })
            }
            

        }
    })

}

// log out btn
document.getElementById("loggout-btn").addEventListener("click", ()=> {
    window.localStorage.removeItem("tokken")
    window.location.href = window.location.href
})


// Dom Manipulation
const paste = document.getElementById("paste");
const sample = document.getElementById("sample");
const mainBox = document.getElementById("mainBox");
const destination = document.getElementById("outbox");
const words = document.getElementById("words")
const words_context = document.getElementById("words-context")
const mainBg = document.getElementById("mainBg");
const alertBox = document.getElementById("alert");
paste.addEventListener("click", ()=>{
    navigator.clipboard
    .readText()
    .then((clipText) => {
        destination.value="";
        destination.value = clipText;
        destination.classList.remove("hidden")
        words.classList.remove("textarea-words")
        mainBox.classList.add("hidden")
        words_context.innerText= `Words: ${countWordsUsingReplace(destination.value)}/200`

    })
})
sample.addEventListener("click", ()=>{
    destination.value="";
    const sample = `Congratulations! Thanks to a good friend U have WON the £2,000 Xmas prize. 2 claim is easy, just call 08718726971 NOW! Only 10p per minute. BT-national-rate.`
        destination.value = sample;
        destination.classList.remove("hidden");
        words.classList.remove("textarea-words")
        mainBox.classList.add("hidden")
        words_context.innerText= `Words: ${countWordsUsingReplace(destination.value)}/200`

})
mainBg.addEventListener("click", ()=>{
        destination.classList.remove("hidden");
        words.classList.remove("textarea-words")
        mainBox.classList.add("hidden")
        destination.focus()
})

function countWordsUsingReplace(str) {
// Replace multiple spaces, newlines, and tabs with a single space
const normalizedStr = str.replace(/\s+/g, ' ').trim();
// Split the string by a single space and count the resulting words
return normalizedStr === '' ? 0 : normalizedStr.split(' ').length;

}


// clear Btn
const clear = document.getElementById("clear-btn")
clear.addEventListener("click", ()=>{
    destination.value="";
    mainBox.classList.remove("hidden");
    words.classList.add("textarea-words")
    destination.classList.add("hidden");
    words_context.innerText = "Words: 0/200"
    document.getElementById("response").classList.add("hidden")
    
})
// words
const inputHandler = function (e){
    const value  = e.target.value.toString();
    words_context.innerText=`Words: ${value.split(' ').length || 0 }/200`
    
}
destination.addEventListener("input", inputHandler);
destination.addEventListener("propertychange", inputHandler)



// Submit btn
const submit = document.getElementById("submit-btn");

submit.addEventListener("click", ()=> {
    if(countWordsUsingReplace(destination.value) >= 10  && countWordsUsingReplace(destination.value) <= 200){
        // sending api call
        // sending fetch request ot backend
        fetch('/submit', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text: destination.value})
        }).then(res=> res.json()).then(data=>{
            document.getElementById("response-ans").innerText = data
            document.getElementById("response").classList.remove("hidden")
        }
        )
    }
    else{
        alertBox.classList.remove("alert-hide")
        alertBox.classList.add("alert-show")
        if(countWordsUsingReplace(destination.value) < 10) {
            alertBox.innerHTML = "Please type at least <br> 10 words"
        }
       else if(countWordsUsingReplace(destination.value) > 10) {
            alertBox.innerHTML = "Please type at below <br> 200 words"
        }
        setTimeout(()=>{
            alertBox.classList.add("alert-hide")
            alertBox.classList.remove("alert-show")
        },2000)
    }

})

// fetching info of client

fetch("https://ipinfo.io/json").then(
            (response) => response.json()).then(
            (response) => {
            document.getElementById("location").innerText = `Location: ${response.country}, ${response.region}, ${response.city}`;
}).catch(err=> console.log(err))



// choose file
const pickerActivator = document.getElementById("choose-file")
const filePicker = document.getElementById("picker")
pickerActivator.addEventListener("click", ()=>{
    filePicker.value = null
    filePicker.click()

})
filePicker.onchange =  ()=>{
    destination.classList.remove("hidden");
    words.classList.remove("textarea-words")
    mainBox.classList.add("hidden")
    
    var result = ""
    const file = filePicker.files[0]
    var reader = new FileReader();
    reader.onload = function(progressEvent) {
    // Entire file
    const text = this.result;
    // By lines
    
    var lines = text.split('\n');
    console.log(lines)
    for (var line = 0; line < lines.length; line++) {
        if(result === "")
            result += lines[line].split('\r')[0]
        else
            result =result + " "+ lines[line].split('\r')[0]
    }
    destination.value = ""
    destination.value = result
    result.split(' ').length
    words_context.innerText=`Words: ${result.split(' ').length || 0 }/200`
    
};
    reader.readAsText(file)

    
    
}



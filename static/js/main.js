// auth
const {pathname} = window.location;
if (pathname == "/login" || pathname == "/signup" || pathname == "/forgetpassword"){
    document.getElementById("dark-bg")
    document.querySelector("body").style = "overflow: hidden;"
}
else{
    document.getElementById("dark-bg").remove()
}
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
        destination.innerText = clipText;
        destination.classList.remove("hidden")
        words.classList.remove("textarea-words")
        mainBox.classList.add("hidden")
        words_context.innerText= `Words: ${countWordsUsingReplace(destination.value)}/200`

    })
})
sample.addEventListener("click", ()=>{
    const sample = `Congratulations! Thanks to a good friend U have WON the £2,000 Xmas prize. 2 claim is easy, just call 08718726971 NOW! Only 10p per minute. BT-national-rate.`
        destination.innerText = sample;
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
    destination.innerText="";
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

// read file to input form

// Submit btn
const submit = document.getElementById("submit-btn");

submit.addEventListener("click", ()=> {
    if(countWordsUsingReplace(destination.value) >= 10){
        // sending api call
        document.getElementById("response").classList.remove("hidden")
        // sending fetch request ot backend
        fetch('/submit', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text: destination.value})
        }).then(res=> res.json()).then(data=>
            console.log(data)    
        )
    }
    else{
        console.log("yo")
        alertBox.classList.remove("alert-hide")
        alertBox.classList.add("alert-show")
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
})



// choose file
const pickerActivator = document.getElementById("choose-file")
const filePicker = document.getElementById("picker")
pickerActivator.addEventListener("click", ()=>{
    filePicker.click()
})
filePicker.addEventListener("change", ()=>{
    var result = ""
    const file = filePicker.files[0]
    var reader = new FileReader();
    reader.onload = function(progressEvent) {
    // Entire file
    const text = this.result;
    // By lines
    var lines = text.split('\n');
    for (var line = 0; line < lines.length; line++) {
        if(result !== "") result = result + " " + lines[line]
        else result = lines[line]
    }
    destination.innerText = result
    result.split(' ').length
    words_context.innerText=`Words: ${result.split(' ').length || 0 }/200`
};
    reader.readAsText(file)

    destination.classList.remove("hidden");
    words.classList.remove("textarea-words")
    mainBox.classList.add("hidden")
    
})


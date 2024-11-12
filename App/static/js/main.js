const email_form = document.getElementById("email")
const body_form = document.getElementById("outbox")
const footer_form = document.getElementById("footer-form")
const submit_btn = document.getElementById("submit-btn")
submit_btn.addEventListener("click", () => {
    email_form.value = ""
    footer_form.value = ""
    console.log(body_form.value)
    fetch('/submit', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body_form.value })
    }).then(res => {
        if (res.status == 400) {
            window.localStorage.removeItem("tokken")
            window.location.href = window.location.href + "login"
        }
        else if (res.status == 200) {
            res.json().then(data => {
                window.location.hash = "outbox"
                document.getElementById("response-ans").innerHTML = `<span style="font-weight: 700;">Too Bad!</span> It's a <span style="font-weight: 700; color: #FD1803;">Spam.</span> `
                document.getElementById("response").classList.remove("hidden")
                document.getElementById("location").style = "display: block"
            }
            )
        }
        else if (res.status == 300) {
            res.json().then(data => {
                window.location.hash = "outbox"
                document.getElementById("response-ans").innerHTML = `<span style="font-weight: 700;">Hooray!</span> It's not a <span style="font-weight: 700; color: #5084FB;">Spam</span>`
                document.getElementById("location").style = "display: none"
                document.getElementById("response").classList.remove("hidden")
            }
            )
        }
    })

})
fetch("https://ipinfo.io/json").then(
    (response) => response.json()).then(
        (response) => {
            document.getElementById("location").innerHTML = `<div id="location" style="font-weight: 500;"><span style="font-weight: 800;">Geographical location: </span>${response.country}, ${response.region}, ${response.city}</div>`
        }).catch(err => console.log(err))
// choose file
const pickerActivator = document.getElementById("choose-file")
const filePicker = document.getElementById("picker")
pickerActivator.addEventListener("click", () => {
    filePicker.value = null
    filePicker.click()

})
filePicker.onchange = () => {
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

        for (var line = 0; line < lines.length; line++) {
            if (result === "")
                result += lines[line].split('\r')[0]
            else
                result = result + " " + lines[line].split('\r')[0]
        }
        destination.value = ""
        destination.value = result
        result.split(' ').length
        words_context.innerText = `Words: ${result.split(' ').length || 0}/200`

    };
    reader.readAsText(file)



}



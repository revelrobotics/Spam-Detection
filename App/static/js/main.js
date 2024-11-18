const email_form = document.getElementById("email")
const ip_form = document.getElementById("ip")
const body_form = document.getElementById("outbox")
const footer_form = document.getElementById("footer-form")
const submit_btn = document.getElementById("submit-btn")
submit_btn.addEventListener("click", () => {
    fetch('/submit', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email_form.value,
            body: body_form.value,
            footer: footer_form.value
        })
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                window.location.hash = "outbox"
                document.getElementById('result').innerHTML = data.content
                document.getElementById("response").classList.remove("hidden")
                document.getElementById("location").style = "display: block"
                fetch(`https://ipinfo.io/${ip_form.value}/json`).then(
                    (response) => response.json()).then(
                        (response) => {
                            document.getElementById("location").innerHTML = `<div id="location" style="font-weight: 500;"><span style="font-weight: 800;">Geographical location: </span>${response.country}, ${response.region}, ${response.city}</div>`
                        }).catch(err => console.log(err))
            }
            )
        }
        else if (res.status == 300) {
            res.json().then(data => {
                window.location.hash = "outbox"
                document.getElementById('result').innerHTML = data.content;
                document.getElementById("location").style = "display: none"
                document.getElementById("response").classList.remove("hidden")
            }
            )
        }
    })

})

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



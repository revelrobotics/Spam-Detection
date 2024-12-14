const logOut = document.getElementById("loggout-btn")
const login = document.getElementById("login")
const signup = document.getElementById("signup")
function checkError() {
    const tokken = window.localStorage.getItem("tokken")
    if (!tokken) {
        login.classList.remove("hidden")
        signup.classList.remove("hidden")
    }
    else {
        try {
            fetch('/protected', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${tokken}`,
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status == 401) {
                    window.localStorage.removeItem("tokken")
                    login.classList.remove("hidden")
                    signup.classList.remove("hidden")
                }
                else if (res.status == 200) logOut.classList.remove("hidden")
            }).catch(err => console.log("Server side is too much for you"))
        }
        catch (e) {
            console.log("Just give up programming", e)
        }
    }
}
checkError()
logOut.addEventListener("click", () => {
    window.localStorage.removeItem("tokken")
    window.location.reload()
})
const email_form = document.getElementById("email")
const ip_form = document.getElementById("ip")
const body_form = document.getElementById("outbox")
const footer_form = document.getElementById("footer-form")
const submit_btn = document.getElementById("submit-btn")
var isEnable = true
submit_btn.addEventListener("click", () => {
    if (!isEnable) return
    isEnable = false
    submit_btn.style.opacity = "0.5"
    submit_btn.style.cursor = "default"
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
                            document.getElementById("location").innerHTML = `<div id="location" style="font-weight: 500; width:100%;"><div style="font-weight: 800;">Geographical location: </div>
                               <ul>
                                <li>
                                    <span style="font-weight: 800;">ip: </span>
                                    ${response.ip}
                                </li>
                                <li>
                                    <span style="font-weight: 800;">city: </span>
                                    ${response.city}
                                </li>
                                 <li>
                                    <span style="font-weight: 800;">region: </span>
                                    ${response.region}
                                </li>
                                 <li>
                                    <span style="font-weight: 800;">country: </span>
                                    ${response.country}
                                </li>
                                 <li>
                                    <span style="font-weight: 800;">postal: </span>
                                    ${response.postal}
                                </li>
                                 <li>
                                    <span style="font-weight: 800;">timezone: </span>
                                    ${response.timezone}
                                </li>
                            </ul>
                                `
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
    }).finally(() => {
        isEnable = true
        submit_btn.style.cursor = "pointer"
        submit_btn.style.opacity = "1.0"

    })

})


// choose file
const pickerActivator = document.getElementById("choose-file")
const filePicker = document.getElementById("picker")
pickerActivator.addEventListener("click", () => {
    if (!filePicker) return;
    filePicker.value = null
    filePicker.click()
})

filePicker.onchange = () => {
    if (filePicker === "") return
    const typefile = filePicker.value.split('.')[1]
    const file = filePicker.files[0]
    switch (typefile) {
        case 'txt':
            var reader = new FileReader();
            reader.onload = function(progressEvent) {
                // Entire file
                const text = this.result;
                // By lines

                var lines = text.split('\n');

                for (var line = 0; line < lines.length; line++) {
                    if (lines[line] === "" && body_form.value == "") body_form.value += "\n"
                    else body_form.value += "\n" + lines[line]
                }

            };
            reader.readAsText(file)
            break;
        case 'pdf':
            body_form.value = "waiting..."
            const formData = new FormData();
            formData.append('file', file);

            fetch(`https://v2.convertapi.com/convert/pdf/to/txt?Secret=secret_SrOfU6cxXX2nRwwp&storefile=true`, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.Files && data.Files.length > 0) {
                        const fileUrl = data.Files[0].Url;

                        // Fetch the text content from the returned URL
                        return fetch(fileUrl);
                    } else {
                        throw new Error('No files returned from the conversion.');
                    }
                })
                .then(response => response.text())
                .then(text => {
                    body_form.value = text;
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to convert PDF to text.');
                });
            break;
        default:
            alert('format doesn\'t supported')
            filePicker.value = ""
            break;

    }

}
var active = "outbox"
body_form.addEventListener("click", () => {
    active = "outbox"
})
email_form.addEventListener("click", () => {
    active = "email"
})
ip_form.addEventListener("click", () => {
    active = "ip"
})
footer_form.addEventListener("click", () => {
    active = "footer-form"

})
const paste_btn = document.getElementById("paste-btn")
paste_btn.addEventListener("click", async () => {
    document.getElementById(active).value = await navigator.clipboard.readText()
})
const clear_btn = document.getElementById("clear-btn")
clear_btn.addEventListener("click", () => {
    body_form.value = ""
    email_form.value = ""
    ip_form.value = ""
    footer_form.value = ""
})



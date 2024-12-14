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
            }).catch(err => console.log("Server side is too much for you", err))
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

// forms
const ip_form = document.getElementById("ip")
const body_p1 = document.getElementById("p1-outbox")
const body_p2 = document.getElementById("p2-outbox")
const compars = document.getElementById("com-outbox")
const checker_submit_btn = document.getElementById("checker-submit-btn")

const textarea_error = document.getElementById("error-textarea")
// file choser

chooseFile("p1-outbox", "p1-choose-file", "p1-picker")
chooseFile("p2-outbox", "p2-choose-file", "p2-picker")
chooseFile("com-outbox", "com-choose-file", "com-picker")
var isEnable = true
checker_submit_btn.addEventListener("click", () => {
    if (!isEnable) return;
    if (!body_p2.value || !body_p1.value || !compars.value || !ip_form.value) {
        textarea_error.classList.remove("hidden")
    }
    else {
        textarea_error.classList.add("hidden")
        isEnable = false
        checker_submit_btn.style.opacity = "0.5"
        checker_submit_btn.style.cursor = "default"

        fetch('/checkerSubmit', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                person_one: body_p1.value,
                person_sec: body_p2.value,
                comparison: compars.value,
            })
        }).then(res => {
            if (res.status == 200) {
                res.json().then(data => {
                    window.location.hash = "outbox"
                    document.getElementById('result').innerHTML = data.content
                    document.getElementById("response").classList.remove("hidden")
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
                })
            }
        }).finally(() => {
            isEnable = true
            checker_submit_btn.style.opacity = "1.0"
            checker_submit_btn.style.cursor = "pointer"
        })
    }
})
// choose file
function chooseFile(textarea, chooser, picker) {
    const pickerActivator = document.getElementById(chooser)
    const filePicker = document.getElementById(picker)
    const form = document.getElementById(textarea)
    pickerActivator.addEventListener("click", () => {
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
                        if (lines[line] === "" && form.value == "") form.value += "\n"
                        else form.value += "\n" + lines[line]
                    }

                };
                reader.readAsText(file)
                break;
            case 'pdf':
                form.value = "waiting..."
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
                        form.value = text;
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
}
var active = "outbox"
const paste_btn = document.getElementById("paste-btn")
//paste_btn.addEventListener("click", async () => {
//document.getElementById(active).value = await navigator.clipboard.readText()
//c})
const clear_btn = document.getElementById("clear-btn")
clear_btn.addEventListener("click", () => {
    body_p1.value = ""
    body_p2.value = ""
    ip_form.value = ""
    compars.value = ""
})




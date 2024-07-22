const websocketUrl = "/chat"
const topic = "/topic/greetings"
const app = "/app/hello"
var client = null;

var buttonConnect;
var buttonDisConnect;
var buttonSend;
var conversationDisplay;
var greetings;
var formInput;
var nameInput;

function connect() {
    const sock = new SockJS(websocketUrl);
    client = Stomp.over(sock);
    client.connect({}, () => {
        setConnected(true);
        client.subscribe(topic, payload => {
            showMessage(JSON.parse(payload.body).content)
        })
    })
    console.log("Connected Duy");
}

function disconnect() {
    if (client !== null) {
        client.disconnect();
        setConnected(false);
        console.log("Disconnected");
    }
}

function setConnected(connected) {
    buttonConnect.disable = connected;
    buttonDisConnect.disabled = !connected;
    buttonSend.disabled = !connected;
    if (connected) {
        conversationDisplay.style.display = "block";
    } else {
        conversationDisplay.style.display = "none";
    }
    greetings.innerHTML = "";
}

function showMessage(message) {
    greetings.innerHTML += "<tr><td>" + message + "</td></tr>"
}

function sendMessage() {
    let message = nameInput.value;
    client.send(app, {}, JSON.stringify({"name": message}))
}

document.addEventListener("DOMContentLoaded", function () {
    buttonConnect = document.getElementById("connect");
    buttonDisConnect = document.getElementById("disconnect");
    buttonSend = document.getElementById("send");
    conversationDisplay = document.getElementById("conversation");
    greetings = document.getElementById("greetings");
    formInput = document.getElementById("form");
    nameInput = document.getElementById("name");
    buttonConnect.addEventListener("click", (e) => {
        connect();
        e.preventDefault();
    })
    buttonDisConnect.addEventListener("click", (e) => {
        disconnect();
        e.preventDefault();
    })
    buttonSend.addEventListener("click", (e) => {
        sendMessage();
        e.preventDefault()
    })
    formInput.addEventListener("submit", (e) => e.preventDefault());
    setConnected(false);
})
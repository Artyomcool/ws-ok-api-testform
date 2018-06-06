function initWs() {
    var ws = new WebSocket("wss://apitest.ok.ru/websocket/CBAFJIICABABABABA/-s-2k830tEco21t4c-Yo-30.smXEafibhTHC2240wTfr7177hJd");

    ws.onopen = function(){
    document.getElementById("chatlog").textContent += "open\n";
    };

    ws.onmessage = function(message){
        document.getElementById("chatlog").textContent += message.data + "\n";
        console.log("Got message: " + message.data);
    };

    ws.onerror = function (event) {
        alert("Error " + event);
        console.log("error");
    };

    ws.onclose = function (event) {
        alert("Session closed " + event.code + " : " + event.reason);
        console.log("close session");
    };
}

function postToServer(){
    var messageToSend = document.getElementById("msg").value;
    ws.send(messageToSend);
    document.getElementById("msg").value = "";
    console.log("sent message: " + messageToSend);
}

function closeConnect(){
    ws.close();
}

function flushLog() {
    document.getElementById("msg").value = "";
}

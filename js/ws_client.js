var WS = "";

function initWs() {
    var config = {
        app_id: document.getElementById("app-id").value,
        app_key: document.getElementById("public-key").value
    };
    OKSDK.init(config, function () {
        //on success
    }, function (error) {
        //on error
    });
    login(document.getElementById("user-login").value, document.getElementById("user-password").value, document.getElementById("session-key").value);
}

function postToServer(){
    var messageToSend = document.getElementById("message").value;
    WS.send(messageToSend);
    document.getElementById("message").value = "";
    document.getElementById("chatlog").textContent += "Sent message:" + messageToSend + "\n";
}

function closeConnect(){
    WS.close();
}

function flushLog() {
    document.getElementById("chatlog").textContent = "";
}

function login(userName, pwd, sessionKey) {
    OKSDK.REST.call("auth.login",
            {user_name: userName, password: pwd},
            function (status, data, error) {
                var url = "ws" + getSslPrefix() + "://" + document.getElementById("api-host").value + "/websocket/" + document.getElementById("public-key").value+"/";

                if (document.getElementById("use_session").checked) {
                    if (sessionKey.trim() !== "") {
                        url += "/";
                    }
                    url += sessionKey;
                } else if (status === 'ok') {
                    url += data['session_key'];
                } else if (status !== 'ok') {
                    alert(OKSDK.Util.toString(error));
                };
                WS = new WebSocket(url);

                WS.onopen = function(){
                    document.getElementById("chatlog").textContent += "Connection opened\n";
                };

                WS.onmessage = function(message){
                    document.getElementById("chatlog").textContent += "Got response:" + message.data + "\n";
                    console.log("Got response: " + message.data);
                };

                WS.onerror = function (event) {
                    document.getElementById("chatlog").textContent += "Got error:" + message.data + "\n";
                };

                WS.onclose = function (event) {
                    document.getElementById("chatlog").textContent += "Connection closed\n";
                };
            },
            {no_session: true, app_secret_key: document.getElementById("secret-key").value}
    );
}
function getSslPrefix() {
    if (document.getElementById("ssl-enabled").checked) {
        return "s";
    }

    return "";
}

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
    OKSDK.OK_API_SERVER = "https://"+document.getElementById("api-host").value+"/";
    login(document.getElementById("user-login").value, document.getElementById("user-password").value);
}

function postToServer(){
    var messageToSend = document.getElementById("message").value;
    console.log(WS);
    WS.send(messageToSend);
    document.getElementById("message").value = "";
    console.log("sent message: " + messageToSend);
}

function closeConnect(){
    WS.close();
}

function flushLog() {
    document.getElementById("chatlog").textContent = "";
}

function login(userName, pwd) {
    OKSDK.REST.call("auth.login",
            {user_name: userName, password: pwd},
            function (status, data, error) {
                if (status !== 'ok') {
                    alert(OKSDK.Util.toString(error));
                };
                console.log(data['session_key']);
                var url = "wss://"+document.getElementById("api-host").value+"/websocket/"+document.getElementById("public-key").value+"/"+data['session_key'];
                WS = new WebSocket(url);

                WS.onopen = function(){
                    document.getElementById("chatlog").textContent += "open\n";
                };

                WS.onmessage = function(message){
                    document.getElementById("chatlog").textContent += message.data + "\n";
                    console.log("Got message: " + message.data);
                };

                WS.onerror = function (event) {
                    alert("Error " + event);
                    console.log("error");
                };

                WS.onclose = function (event) {
                    alert("Session closed " + event.code + " : " + event.reason);
                    console.log("close session");
                };
            },
            {no_session: true, app_secret_key: document.getElementById("secret-key").value}
    );
}
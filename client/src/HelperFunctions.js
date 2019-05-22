    export function send(method, url, data, callback){
        let request = new XMLHttpRequest();
        request.onload = function(){
            if (request.status !== 200) callback("[" + request.status + "]" + request.responseText, null);
            else callback(null, JSON.parse(request.responseText));
        };
        request.open(method, url, true);
        if(!data) request.send();
        else {
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify(data));
        }
    }

    export function sendFiles(method, url, data, callback){
        let formdata = new FormData();
        Object.keys(data).forEach(function(key){
            let value = data[key];
            formdata.append(key, value);
        });
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        xhr.send(formdata);
    }

    export function getUserName() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    };
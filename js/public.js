function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function sequence(from, to, step=false, bias=0) {
    let i, res=[];
    if(step === false) step = (from < to ? 1 : -1);
    for(i = from; i <= to; i += step) res.push(i + bias);
    return res;
}

function shuffle(arr) {
    let i, shift, temp;
    for(i = 0; i < arr.length; i++) {
        shift = Math.floor(Math.random() * (arr.length-i) + i);
        temp = arr[i];
        arr[i] = arr[shift];
        arr[shift] = temp;
    }
}

function rerank(arr, fix) {
    for(let aim of fix) {
        arr[arr.indexOf(aim)] = arr[aim];
        arr[aim] = aim;
    }
}

function distance(point1, point2) {
    if(point1.length !== point2.length) return false;
    let res = 0;
    for(i in point1)
        res += (point1[i] - point2[i]) ** 2;
    return res ** 0.5;
}

function interpolation(from, to, length) {
    let i, res = [];
    if(from !== to) {
        let step = (to - from) / length;
        for(i = from; step > 0 ? i <= to : i >= to; i += step) res.push(Math.floor(i));
    } else {
        i = length;
        while(i--) res[i] = from;
    }
    return res;
}
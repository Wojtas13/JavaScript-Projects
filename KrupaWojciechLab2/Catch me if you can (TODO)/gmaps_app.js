let uluru, map, marker;
let ws;
let players = {};
let nickname;

function initMap() {
    nickname = prompt("Podaj swoj nick");
    uluru = { lat: 52.237, lng: 21.017 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: uluru,
        keyboardShortcuts: false
    });

    marker = new google.maps.Marker({
        position: uluru,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'marker.png'
    });
    getLocation();
    serverWebSocket();
    KeyboardMovement();
}

function KeyboardMovement(){
    window.addEventListener('keydown', markerControl);
}

function markerControl(event){
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();

    switch (event.code) {
        case 'ArrowUp':
            lat += 0.1;
            break;
        case 'ArrowDown':
            lat -= 0.1;
            break;
        case 'ArrowLeft':
            lng -= 0.1;
            break;
        case 'ArrowRight':
            lng += 0.1;
            break;
    }
    let position = {
        lat,
        lng
    };
    let wsData = {
        lat: lat,
        lng: lng,
        id: nickname
    };
    marker.setPosition(position);
    ws.send(JSON.stringify(wsData));
    map.setCenter(marker.getPosition())
}
function wsOpen(data) {
    console.log(data);
}
function onWSMessage(e) {
    let data = JSON.parse(e.data)

    data.forEach((entry) => {
        if (!players['user' + entry.id]) {
            players['user' + entry.id] = new google.maps.Marker({
                position: { lat: entry.lat, lng: entry.lng },
                map: map,
                animation: google.maps.Animation.DROP,
                icon: 'marker2.png'
            })
        } else {
            if(nickname != players['user' + entry.id]){
                players['user' + entry.id].setPosition({
                    lat: entry.lat,
                    lng: entry.lng
                })
            }
        }
    });
}
//WebSocket settings
function serverWebSocket() {
    let url = 'ws://localhost:8080';
    ws = new WebSocket(url);
    ws.addEventListener('open', wsOpen);
    ws.addEventListener('message', onWSMessage);
}

//Getting localization
function getLocation(){
    navigator.geolocation.getCurrentPosition(geoAccept, geoError);
}
//Setting marker with coords
function geoAccept(position){
    let coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    map.setCenter(coords);
    marker.setPosition(coords);
}
let errMsg = document.getElementById('error');
//Alert when user block access to location
function geoError(){
    errMsg.style.display = "block";
    errMsg.innerHTML =  "No GeoLocation No Fun :(";
}
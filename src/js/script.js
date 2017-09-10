var unit = 'C';
var data;
var colors = ['#9dddd7', '#1f3265', '#040928'];
$(document).ready(function() {
    if ("geolocation" in navigator) {
        $("#weather-section .body .warning-message").addClass("d-none");
        $("#info").removeClass("d-none");
        getWeather();
    }
    else {
        $("#weather-section .body .warning-message").removeClass("d-none");
        $("#info").addClass("d-none");
    }
    $("#info button").on("click", function() {
        if ($(this).hasClass("disabled")) {
            return;
        }
        $(this).addClass("disabled");
        changeUnit();
        showInfo(data);
    });
});

function changeUnit() {
    if (unit == 'C') {
        unit = 'F';
        $("#celsius").removeClass("disabled");
    }
    else {
        unit = 'C';
        $("#far").removeClass("disabled");
    }
}

function returnTemp(val) {
    if (unit == 'C') {
        return Math.round(val*1000)/1000;
    }
    return Math.round((val*1.8+32)*1000)/1000;
}

function showInfo(json) {
    $("#city").text(json.name + ', ');
    $("#country").text(json.sys.country);
    $("#temp").text(returnTemp(json.main.temp) + ' ');
    $("#unit").text('°' + unit);
    $("#weather").text(json.weather[0].main);
    $("#weather-icon").attr("src", json.weather[0].icon);
    $("#weather-icon").attr("alt", json.weather[0].description);
    $("#weather-icon").attr("title", json.weather[0].description);
}

function getWeather() {
    var lat=0;
    var lon=0;
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log('Latitude: ' + lat + ', Longitude: ' + lon);
        $.ajax({
            url: "https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon,
            success: function(json) {
                data = json;
                showInfo(data);
            }
        });
    });
}

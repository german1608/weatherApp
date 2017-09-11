var unit = 'C';
var data;
var colors = ['#9dddd7', '#4f6ab3', '#040928'];
var bgColor=1;
var done = false;
$(document).ready(function() {
    // TIME
    alertTimer();
    var d = new Date();
    var h = d.getHours();
    console.log(d);
    //morning
    if (4 <= h && h <= 12) {
        bgColor=0;
    }
    //afternoon
    else if (13 <= h && h <= 18) {
        bgColor=1;
    }
    //night
    else {
        bgColor=2;
    }
    $("body").css("background-color", colors[bgColor]);

    if ("geolocation" in navigator) {
        $("#weather-section .body .warning-message").addClass("d-none");
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

//timer
function alertTimer() {
    setTimeout(alerta, 10000);
}

function alerta() {
    if (!done) {
        alert("This is taking a while.\nPlease allow FCC Weather App to access your location, check that your browser is updated or check internet connection and then reload.");
    }
}

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
        return Math.round(val*100)/100;
    }
    return Math.round((val*1.8+32)*100)/100;
}

function showInfo(json) {
    $("#city").text(json.name + ', ');
    $("#country").text(json.sys.country);
    $("#temp").text(returnTemp(json.main.temp));
    $("#unit").text('°' + unit);
    $("#weather").text(json.weather[0].main);
    $("#weather-icon").attr("src", json.weather[0].icon);
    $("#weather-icon").attr("alt", json.weather[0].description);
    $("#weather-icon").attr("title", json.weather[0].description);
    // buttons
    $("#loader-container").addClass("d-none");
    $("#info").removeClass("d-none");
}

function getWeather() {
    var lat=0;
    var lon=0;
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log('Latitude: ' + lat + ', Longitude: ' + lon);
        var urlApi = "https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon;
        console.log('acceding to ' + urlApi);
        $.ajax({
            url: urlApi,
            success: function(json) {
                done = true;
                data = json;
                showInfo(data);
            },
            error: function (jqXHR, exception) {
               var msg = '';
               if (jqXHR.status === 0) {
                   msg = 'Not connect.\n Verify Network.';
               } else if (jqXHR.status == 404) {
                   msg = 'Requested page not found. [404]';
               } else if (jqXHR.status == 500) {
                   msg = 'Internal Server Error [500].';
               } else if (exception === 'parsererror') {
                   msg = 'Requested JSON parse failed.';
               } else if (exception === 'timeout') {
                   msg = 'Time out error.';
               } else if (exception === 'abort') {
                   msg = 'Ajax request aborted.';
               } else {
                   msg = 'Uncaught Error.\n' + jqXHR.responseText;
               }
               console.log(msg);
               getWeather();
           }
        });
    });
}

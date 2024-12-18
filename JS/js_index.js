var http = new XMLHttpRequest();

var api_response ;
var forecast_3Days ;
var day ; var date ;   var temp ;  var result_location ; var condition;
var input;
var api;
var parentElement = document.getElementById("forecast-container");
var parentElement = document.getElementById("forecast-container");


function fetchWeather(input) {
    return new Promise((resolve, reject) => {
        // Check if input is empty
        if (input === "") {
            reject("Input is empty");
            return;
        }
        if (!parentElement) {
            reject("Forecast container not found in the DOM");
            return;
        }

        // Clear previous content
        parentElement.innerHTML=`<div class="forecast " id="first-forecast" style="width: 33.33%;">
                    </div>`; 

        const api = `https://api.weatherapi.com/v1/forecast.json?key=8109a6367f3e4133ade115459241412&q=${input}&days=7`;
        const http = new XMLHttpRequest();

        http.open('GET', api);
        http.send();

        http.addEventListener('load', function () {
            try {
                const api_response = JSON.parse(http.response);
                resolve(api_response); 
            } catch (error) {
                reject("Error processing API response");
            }
        });

        http.addEventListener("error", function () {
            reject("HTTP request error");
        });
    });
}

// Example usage:
const searchElement = document.getElementById('search');
searchElement.addEventListener('input', () => {
    const input = searchElement.value.trim();
    fetchWeather(input)
        .then(api_response => {
            const forecast_3Days = Get3DaysForecast(api_response);
            fillFirstForecast(forecast_3Days[0]);
            fillForecastPrediction(forecast_3Days);
        })
        .catch(error => console.error(error));
});






function fillFirstForecast(forecast) {

    var Element = document.getElementById("first-forecast");   
    Element.innerHTML=` <div class="forecast-header" id="today">
                    <div id="day">${forecast.day}</div>
                    <div id=" date">${forecast.date}</div>
                    </div> <!-- .forecast-header -->
                    <div class="forecast-content" id="current">
                    <div id="location">${forecast.result_location}</div>
                    <div id="degree">
                        <div id="temp">${forecast.temp_c}<sup>o</sup>C</div>
                      
                        <div class="forecast-icon">
                            <img src="${forecast.icon_img}" alt="" width="90">
                        </div>	
                    
                    </div>
                    <div class="custom">${forecast.condition}</div>
                    <span><img src="Weather_imgs/icon-umberella.png" alt="umberella">20%</span>
                                                <span><img src="Weather_imgs/icon-wind.png" alt="wind">18km/h</span>
                                                <span><img src="Weather_imgs/icon-compass.png" alt="compass">East</span>`;
    
}


function GetDayNameofDate(apiDate) {
const dateObject = new Date(apiDate);
const dayIndex = dateObject.getDay();
var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   return daysOfWeek[dayIndex];
}

function GetMonthandDayofDate(apiDate) {
    const dateObject = new Date(apiDate);
    const monthIndex = dateObject.getMonth();
    const monthsOfYear = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return dateObject.getDate() + " " + monthsOfYear[monthIndex];
}



function Get3DaysForecast(api_response) {
    var object_forecast;
    var arr_forecast = [];
    for (let index = 0; index < 3; index++) {
        object_forecast = {
            day : GetDayNameofDate(api_response.forecast.forecastday[index].date),
            date : GetMonthandDayofDate (api_response.forecast.forecastday[index].date),
            temp_c: api_response.forecast.forecastday[index].day.avgtemp_c,
            temp_f: api_response.forecast.forecastday[index].day.avgtemp_f,
            result_location : api_response.location.name,
            condition : api_response.forecast.forecastday[index].day.condition.text,
            icon_img :"https://"+api_response.forecast.forecastday[index].day.condition.icon,
        }
        arr_forecast.push(object_forecast);
    }
    return arr_forecast;
}

function fillForecastPrediction(arr_forecast) {

    for (let index = 1; index < arr_forecast.length; index++) {
       parentElement.innerHTML +=`<div class="forecast" style="width: 33.33%;">
        <div class="forecast-header">
            <div class="day">${arr_forecast[index].day}</div>
        </div> 
        <div class="forecast-content">
            <div class="forecast-icon">
                <img src="${arr_forecast[index].icon_img}" alt="" width="48">
            </div>
            <div class="degree">${arr_forecast[index].temp_c}<sup>o</sup>C</div>
            <small>${arr_forecast[index].temp_f}<sup>o</sup></small>
            <div class="custom">Sunny</div>
        </div>
        </div>`;
        
    }
}
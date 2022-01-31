import Data from "/config.js";
import {
    windDirectionConvertor
} from "./windDirectionConvertor.js";

const currentWeatherWrapper = document.getElementById("currentWeatherWrapper");
const carouselInner = document.getElementById("carouselInner");

const createAllDayCards = (result) => {
    for (let i = 1; i < result.daily.length; i++) {
        createDailyCard(result, result.daily[i]);
    }
}

function createElement(element, className, parent) {
    const newElement = document.createElement(element);
    newElement.classList = className;
    parent.appendChild(newElement);

    return newElement;
}

const createCurrentCard = (result) => {
    const currentWeatherWrapper = document.getElementById("currentWeatherWrapper");
    const currentResult = result.current;
    const currentWeatherCard = createElement("div", "currentWeatherCard", currentWeatherWrapper);

    const currentTitleDiv = createElement("div", "currentTitleDiv", currentWeatherCard)

    const currentInfoDiv = createElement("div", "currentInfoDiv", currentWeatherCard);

    const currentTitle = createElement("h3", "currentTitle", currentTitleDiv)
    currentTitle.innerHTML = "Current Weather";

    const currentHour = createElement("p", "currentHour", currentTitleDiv)
    let sec = currentResult.dt + result.timezone_offset;
    currentHour.innerHTML = "at " + (new Date(sec * 1000).getHours() - 1) + "h";

    const iconCurrent = createElement("img", "iconCurrent", currentInfoDiv);
    iconCurrent.src = "http://openweathermap.org/img/wn/" + currentResult.weather[0].icon + "@2x.png";

    const currentTemperatureDiv = createElement("div", "currentTemperatureDiv", currentInfoDiv);

    const temperatureCurrent = createElement("h1", "temperatureCurrent", currentTemperatureDiv);
    temperatureCurrent.innerHTML = Math.round(currentResult.temp) + "°C";

    const feelTemperatureCurrent = createElement("h6", "feelTemperatureCurrent", currentTemperatureDiv);
    feelTemperatureCurrent.innerHTML = "feels like: " + Math.round(currentResult.feels_like) + "°C";

    const currentWindDiv = createElement("div", "currentWindDiv", currentInfoDiv);

    const currentWindIcon = createElement("img", "currentWindIcon", currentWindDiv);
    currentWindIcon.src = "/images/up-arrow-svgrepo-com.svg";
    currentWindIcon.style.transform = "rotate3d(0, 0, 1, " + currentResult.wind_deg + "deg)";

    const currentWindSpeed = createElement("h5", "currentWindSpeed", currentWindDiv);
    currentWindSpeed.innerHTML = Math.round(currentResult.wind_speed * 3.6) + " km/h"
}

const createDailyCard = (result, dailyResult) => {
    const carouselInner = document.getElementById("carouselInner")
    const card = document.createElement("div");
    if (dailyResult == result.daily[0]) {
        card.classList.add("card", "carousel-item", "active");
    } else {
        card.classList.add("card", "carousel-item");
    }
    carouselInner.appendChild(card);

    const displayDay = createElement("h3", "displayDay", card);
    let sec = dailyResult.dt + result.timezone_offset;
    displayDay.innerHTML = new Date(sec * 1000).toDateString();

    const weatherImgDiv = createElement("div", "weatherImgDiv", card);

    const weatherInfoDiv = createElement("div", "weatherInfoDiv", card);

    const weatherIcon = createElement("img", "weatherIcon", weatherImgDiv);
    weatherIcon.src = "http://openweathermap.org/img/wn/" + dailyResult.weather[0].icon + "@2x.png";

    const windDiv = createElement("div", "windDiv", weatherImgDiv);

    const windIcon = createElement("img", "windIcon", windDiv);
    windIcon.src = "/images/up-arrow-svgrepo-com.svg";
    windIcon.style.transform = "rotate3d(0, 0, 1, " + dailyResult.wind_deg + "deg)";

    const windDescriptionDiv = createElement("div", "windDescriptionDiv", windDiv);

    const windSpeed = createElement("h5", "windSpeed", windDescriptionDiv);
    windSpeed.innerHTML = Math.round(dailyResult.wind_speed * 3.6) + " km/h"

    const degree = windDirectionConvertor(dailyResult);
    //result AND i are inside the () to send the values of both to the function, 
    // so the function has the correct parameters to work with

    const windDirection = createElement("p", "windDirection", windDescriptionDiv);
    windDirection.innerHTML = degree;

    const temperatureDiv = createElement("div", "temperatureDiv", weatherInfoDiv);

    const weatherDescription = createElement("p", "weatherDescription", weatherInfoDiv);
    weatherDescription.innerHTML = dailyResult.weather[0].description;

    const tempMax = createElement("p", "tempMax", temperatureDiv);
    tempMax.innerHTML = "Max: " + Math.round(dailyResult.temp.max) + "°C";

    const tempMin = createElement("p", "tempMin", temperatureDiv);
    tempMin.innerHTML = "Min: " + Math.round(dailyResult.temp.min) + "°C";
}

const getEveryHour = (result) => {
    const labels = [];
    for (let i = 0; i < 24; i++) { //Create the labels: ex: 14h, 15h, 16h,... for the upcoming 24hours
        const unixHour = result.hourly[i].dt + result.timezone_offset;
        const localHour = (new Date(unixHour * 1000).getHours()) + "h";
        labels.push(localHour); //push every created hour inside the "labels"-array.
    }
    return labels;
}

let myFirstChart, mySecondChart, myRainChart = null;

const createFirstChart = (result) => {
    const labels = getEveryHour(result);

    let temperatureData = [];
    for (let i = 0; i < 24; i++) {
        const hourlyTemperatureData = result.hourly[i].temp;
        temperatureData.push(hourlyTemperatureData);
    }

    let feelTemperatureData = [];

    for (let i = 0; i < 24; i++) {
        const hourlyFeelTemperature = result.hourly[i].feels_like;
        feelTemperatureData.push(hourlyFeelTemperature);
    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'Actual Temperature',
            borderColor: 'rgb(255, 99, 132)',
            data: temperatureData,
        }, {
            label: 'Feels-like Temperature',
            data: feelTemperatureData,
            borderColor: 'rgb(44, 116, 150)',
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    };

    if (myFirstChart != null) {
        myFirstChart.destroy();
    }

    myFirstChart = new Chart(
        document.getElementById('myFirstChart'),
        config
    );
}

const msToBeaufort = (ms) => {
    return Math.ceil(Math.cbrt(Math.pow(ms / 0.836, 2)));
}

const createSecondChart = (result) => {
    const labels = getEveryHour(result);

    let windSpeedData = [];

    for (let i = 0; i < 24; i++) {
        const hourlyWindSpeed = msToBeaufort(result.hourly[i].wind_speed);
        windSpeedData.push(hourlyWindSpeed);
    }

    let windGustsData = [];

    for (let i = 0; i < 24; i++) {
        const hourlyWindGusts = msToBeaufort(result.hourly[i].wind_gust);
        windGustsData.push(hourlyWindGusts);
    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'Windspeed in bft',
            data: windSpeedData,
            borderColor: 'rgb(255, 99, 132)',
        }, {
            label: 'Windgusts in bft',
            data: windGustsData,
            borderColor: 'rgb(44, 116, 150)',
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    };

    if (mySecondChart != null) {
        mySecondChart.destroy();
    }

    mySecondChart = new Chart(
        document.getElementById('mySecondChart'),
        config
    );
}

const createRainChart = (result) => {
    const labels = getEveryHour(result);

    let rainData = [];
    for (let i = 0; i < 24; i++) {

        if (typeof result.hourly[i].rain != "undefined") {
            //the raindata exists
            rainData.push(result.hourly[i].rain["1h"]);
        } else {
            // raindata does not exist in the openweathermap-data
            rainData.push(0);
        }
    }

    let snowData = [];
    for (let i = 0; i < 24; i++) {

        if (typeof result.hourly[i].snow != "undefined") {
            //the snowdata exists
            snowData.push(result.hourly[i].snow["1h"]);
        } else {
            // snowdata does not exist in the openweathermap-data
            snowData.push(0);
        }
    }

    const data = {
        labels: labels,
        datasets: [{
                label: 'Rain in mm',
                backgroundColor: 'rgb(49, 135, 216)',
                borderColor: 'rgb(255, 99, 132)',
                data: rainData,
            },
            {
                label: 'Snow in mm',
                backgroundColor: 'rgb(168, 194, 219)',
                borderColor: 'rgb(255, 99, 132)',
                data: snowData,
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    if (myRainChart != null) {
        myRainChart.destroy();
    }

    myRainChart = new Chart(
        document.getElementById('myRainChart'),
        config
    );
}

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", () => {
    const searchBar = document.getElementById("searchBar");
    let searchInput = searchBar.value.toLowerCase();
    if (searchInput == "") {
        return
    }
    const chartsSection = document.getElementsByClassName("charts")[0];
    chartsSection.style.display = "block";
    currentWeatherWrapper.innerHTML = ""; //Make sure the previous searchresults will disappear
    carouselInner.innerHTML = ""; //Make sure the previous searchresults will disappear

    fetch("https://api.unsplash.com/search/photos?query=" + searchInput + "&client_id=" + Data.UNSPLASH_API_KEY)
        .then(response => response.json())
        .then(unsplashData => {
            console.log(unsplashData);
            const randomNumber = Math.round(Math.random() * unsplashData.results.length)
            document.body.style.backgroundImage = "url(" + unsplashData.results[randomNumber].urls.regular + ")"
        })

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchInput + '&appid=' + Data.key)
        .then(response => response.json())
        .then(data => {
            const lat = data.city.coord.lat; //catch the latitude of the city that the user has typed
            const long = data.city.coord.lon; //catch the longitude of the city that the user has typed

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&exclude=minutely&units=metric&appid=' + Data.key)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    createCurrentCard(result);
                    createDailyCard(result, result.daily[0]);
                    createAllDayCards(result);
                    createFirstChart(result);
                    createSecondChart(result);
                    createRainChart(result);
                })
        });
});
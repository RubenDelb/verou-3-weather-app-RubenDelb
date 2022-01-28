import Data from "/config.js";
import {
    windDirectionConvertor
} from "./windDirectionConvertor.js";

const searchBar = document.getElementById("searchBar");
const submitBtn = document.getElementById("submitBtn");
const currentWeatherWrapper = document.getElementById("currentWeatherWrapper");
const carouselInner = document.getElementById("carouselInner");
const chartsSection = document.getElementsByClassName("charts")[0];

submitBtn.addEventListener("click", () => {
    let searchInput = searchBar.value.toLowerCase();
    if (searchInput == "") {
        return
    }
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

                    for (let i = 1; i < result.daily.length; i++) {
                        createDailyCard(result, result.daily[i]);
                    }

                    createFirstChart(result);

                    createSecondChart(result);

                    createRainChart(result);
                })
        });
});

function createCurrentCard(result) {
    const currentWeatherWrapper = document.getElementById("currentWeatherWrapper")
    const currentWeatherCard = document.createElement("div");
    currentWeatherCard.classList.add("currentWeatherCard");
    currentWeatherWrapper.appendChild(currentWeatherCard);

    const currentTitleDiv = document.createElement("div");
    currentTitleDiv.className = "currentTitleDiv";
    currentWeatherCard.appendChild(currentTitleDiv);

    const currentInfoDiv = document.createElement("div");
    currentInfoDiv.className = "currentInfoDiv";
    currentWeatherCard.appendChild(currentInfoDiv);

    const currentTitle = document.createElement("h3");
    currentTitle.innerHTML = "Current Weather";
    currentTitle.className = "currentTitle";
    currentTitleDiv.append(currentTitle);

    const currentHour = document.createElement("p");
    let sec = result.current.dt + result.timezone_offset;
    currentHour.innerHTML = "at " + (new Date(sec * 1000).getHours() - 1) + "h";
    currentHour.className = "currentHour";
    currentTitleDiv.append(currentHour);

    const iconCurrent = document.createElement("img");
    iconCurrent.src = "http://openweathermap.org/img/wn/" + result.current.weather[0].icon + "@2x.png";
    iconCurrent.className = "iconCurrent";
    currentInfoDiv.appendChild(iconCurrent);

    const currentTemperatureDiv = document.createElement("div");
    currentTemperatureDiv.className = "currentTemperatureDiv";
    currentInfoDiv.appendChild(currentTemperatureDiv);

    const temperatureCurrent = document.createElement("h1");
    temperatureCurrent.className = "temperatureCurrent";
    temperatureCurrent.innerHTML = Math.round(result.current.temp) + "°C";
    currentTemperatureDiv.appendChild(temperatureCurrent);

    const feelTemperatureCurrent = document.createElement("h6");
    feelTemperatureCurrent.className = "feelTemperatureCurrent";
    feelTemperatureCurrent.innerHTML = "feels like: " + Math.round(result.current.feels_like) + "°C";
    currentTemperatureDiv.appendChild(feelTemperatureCurrent);

    const currentWindDiv = document.createElement("div");
    currentWindDiv.className = "currentWindDiv";
    currentInfoDiv.appendChild(currentWindDiv);

    const currentWindIcon = document.createElement("img");
    currentWindIcon.src = "/images/up-arrow-svgrepo-com.svg";
    currentWindIcon.className = "currentWindIcon"
    currentWindIcon.style.transform = "rotate3d(0, 0, 1, " + result.current.wind_deg + "deg)";
    currentWindDiv.appendChild(currentWindIcon);

    const currentWindSpeed = document.createElement("h5");
    currentWindSpeed.className = "currentWindSpeed";
    currentWindSpeed.innerHTML = Math.round(result.current.wind_speed * 3.6) + " km/h"
    currentWindDiv.appendChild(currentWindSpeed);
}

function createDailyCard(result, dailyResult) {
    const carouselInner = document.getElementById("carouselInner")
    const card = document.createElement("div");
    if (dailyResult == result.daily[0]) {
        card.classList.add("card", "carousel-item", "active");
    } else {
        card.classList.add("card", "carousel-item");
    }
    carouselInner.appendChild(card);

    const displayDay = document.createElement("h3");
    let sec = dailyResult.dt + result.timezone_offset;
    displayDay.innerHTML = new Date(sec * 1000).toDateString();
    displayDay.className = "displayDay";
    card.append(displayDay);

    const weatherImgDiv = document.createElement("div");
    weatherImgDiv.className = "weatherImgDiv";
    card.appendChild(weatherImgDiv);

    const weatherInfoDiv = document.createElement("div");
    weatherInfoDiv.className = "weatherInfoDiv";
    card.appendChild(weatherInfoDiv);

    const weatherIcon = document.createElement("img");
    weatherIcon.src = "http://openweathermap.org/img/wn/" + dailyResult.weather[0].icon + "@2x.png";
    weatherIcon.className = "weatherIcon";
    weatherImgDiv.appendChild(weatherIcon);

    const windDiv = document.createElement("div");
    windDiv.className = "windDiv";
    weatherImgDiv.appendChild(windDiv);

    const windIcon = document.createElement("img");
    windIcon.src = "/images/up-arrow-svgrepo-com.svg";
    windIcon.className = "windIcon"
    windIcon.style.transform = "rotate3d(0, 0, 1, " + dailyResult.wind_deg + "deg)";
    windDiv.appendChild(windIcon);

    const windDescriptionDiv = document.createElement("div");
    windDescriptionDiv.className = "windDescriptionDiv";
    windDiv.appendChild(windDescriptionDiv);

    const windSpeed = document.createElement("h5");
    windSpeed.className = "windSpeed";
    windSpeed.innerHTML = Math.round(dailyResult.wind_speed * 3.6) + " km/h"
    windDescriptionDiv.appendChild(windSpeed);

    const degree = windDirectionConvertor(dailyResult);
    //result AND i are inside the () to send the values of both to the function, 
    // so the function has the correct parameters to work with

    const windDirection = document.createElement("p");
    windDirection.className = "windDirection";
    windDirection.innerHTML = degree;
    windDescriptionDiv.appendChild(windDirection);

    const temperatureDiv = document.createElement("div");
    temperatureDiv.className = "temperatureDiv";
    weatherInfoDiv.appendChild(temperatureDiv);

    const weatherDescription = document.createElement("p");
    weatherDescription.className = "weatherDescription";
    weatherDescription.innerHTML = dailyResult.weather[0].description;
    weatherInfoDiv.appendChild(weatherDescription);

    const tempMax = document.createElement("p");
    tempMax.className = "tempMax";
    tempMax.innerHTML = "Max: " + Math.round(dailyResult.temp.max) + "°C";
    temperatureDiv.appendChild(tempMax);

    const tempMin = document.createElement("p");
    tempMin.className = "tempMin";
    tempMin.innerHTML = "Min: " + Math.round(dailyResult.temp.min) + "°C";
    temperatureDiv.appendChild(tempMin);
}

let myFirstChart = null;

function createFirstChart(result) {
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

let mySecondChart = null;

function msToBeaufort(ms) {
    return Math.ceil(Math.cbrt(Math.pow(ms/0.836, 2)));
}

function createSecondChart(result) {
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

let myRainChart = null;

function createRainChart(result) {
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

function getEveryHour(result) {
    const labels = [];

    for (let i = 0; i < 24; i++) { //Create the labels: ex: 14h, 15h, 16h,... for the upcoming 24hours
        const unixHour = result.hourly[i].dt + result.timezone_offset;
        const localHour = (new Date(unixHour * 1000).getHours()) + "h";
        labels.push(localHour); //push every created hour inside the "labels"-array.
    }
    return labels;
}
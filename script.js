import Data from "/config.js";

const searchBar = document.getElementById("searchBar");
const submitBtn = document.getElementById("submitBtn");
const currentWeatherWrapper = document.getElementById("currentWeatherWrapper");
const carouselInner = document.getElementById("carouselInner");

submitBtn.addEventListener("click", () => {
    currentWeatherWrapper.innerHTML = ""; //Make sure the previous searchresults will disappear
    carouselInner.innerHTML = ""; //Make sure the previous searchresults will disappear
    let searchInput = searchBar.value.toLowerCase();
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

                    createChart(result);
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

    const temperatureCurrent = document.createElement("h1");
    temperatureCurrent.className = "temperatureCurrent";
    temperatureCurrent.innerHTML = Math.round(result.current.temp) + "°C";
    currentInfoDiv.appendChild(temperatureCurrent);

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

function windDirectionConvertor(dailyData) {
    let deg = Math.floor(dailyData.wind_deg);
    switch (true) {
        case deg >= 360 && deg <= 21:
            deg = "N";
            break;
        case deg >= 22 && deg <= 44:
            deg = "NNE";
            break;
        case deg >= 45 && deg <= 66:
            deg = "NE";
            break;
        case deg >= 67 && deg <= 89:
            deg = "ENE";
            break;
        case deg >= 90 && deg <= 111:
            deg = "E";
            break;
        case deg >= 112 && deg <= 134:
            deg = "ESE";
            break;
        case deg >= 135 && deg <= 156:
            deg = "SE";
            break;
        case deg >= 157 && deg <= 179:
            deg = "SSE";
            break;
        case deg >= 180 && deg <= 201:
            deg = "S";
            break;
        case deg >= 202 && deg <= 224:
            deg = "SSW";
            break;
        case deg >= 225 && deg <= 246:
            deg = "SW";
            break;
        case deg >= 247 && deg <= 269:
            deg = "WSW";
            break;
        case deg >= 270 && deg <= 291:
            deg = "W";
            break;
        case deg >= 292 && deg <= 314:
            deg = "WNW";
            break;
        case deg >= 315 && deg <= 336:
            deg = "NW";
            break;
        case deg >= 337 && deg <= 359:
            deg = "NNW";
            break;
        default:
            deg = "no data";
    }
    return deg;
    // return is very important to output the wanted result when the function is called.
}

let myChart = null;

function createChart(result) {
    const labels = getEveryHour(result);

    let rainData = [];
    for (let i = 0; i < 24; i++) {

        if (typeof result.hourly[i].rain != "undefined") {
            //the raindata exists
            console.log(result.hourly[i].rain);
            rainData.push(result.hourly[i].rain["1h"]);
        } else if (typeof result.hourly[i].snow != "undefined") {
            //the snowdata exists
            console.log(result.hourly[i].snow);
            rainData.push(result.hourly[i].snow["1h"]);
        } else {
            // raindata or snowdata do not exist
            rainData.push(0);
        }
    }
    console.log(rainData);

    let windSpeedData = [];

    for (let i = 0; i < 24; i++) {
        const hourlyWindSpeed = result.hourly[i].wind_speed;
        windSpeedData.push(hourlyWindSpeed);
    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'Precipitation in mm',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: rainData,
        }, {
            type: 'line',
            label: 'Windspeed in m/s',
            data: windSpeedData,
            borderColor: 'rgb(44, 116, 150)',
        }, {
            type: 'line',
            label: 'Windgusts in m/s',
            data: windSpeedData,
            borderColor: 'rgb(44, 116, 150)',
        }]
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

    if (myChart != null) {
        myChart.destroy();
    }

    myChart = new Chart(
        document.getElementById('myChart'),
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
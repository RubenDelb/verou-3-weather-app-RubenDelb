import Data from "/config.js";

const searchBar = document.getElementById("searchBar");
const submitBtn = document.getElementById("submitBtn");
const mainTag = document.getElementsByTagName("main")[0];

submitBtn.addEventListener("click", () => {
    mainTag.innerHTML= ""; //Make sure the previous searchresults will dissapear
    let searchInput = searchBar.value.toLowerCase();
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchInput + '&appid=' + Data.key)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (let i = 0; i< 8; i++) {
            const newDate = document.createElement("p");
            newDate.innerHTML = data.list[i].dt_txt;
            mainTag.appendChild(newDate);
            const temperatureParagraph = document.createElement("p");
            temperatureParagraph.innerHTML = Math.round(data.list[i].main.temp-273.15) + "°C" + " " + data.list[i].weather[0].description;
            mainTag.appendChild(temperatureParagraph);
            // dateMessage.innerHTML = data.list[0].dt_txt;
            // temperatureMessage.innerHTML = data.list[0].main.temp-273.15;
            
        }
    for (let i = 8; i< 16; i++) {
            const newDate = document.createElement("p");
            newDate.innerHTML = data.list[i].dt_txt;
            mainTag.appendChild(newDate);
            const temperatureParagraph = document.createElement("p");
            temperatureParagraph.innerHTML = Math.round(data.list[i].main.temp-273.15) + "°C" + " " + data.list[i].weather[0].description;
            mainTag.appendChild(temperatureParagraph);
    }
    });
});
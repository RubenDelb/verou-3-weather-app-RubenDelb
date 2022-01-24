import Data from "/config.js";

console.log(Data.key);

const dateMessage = document.getElementById("dateMessage");
const temperatureMessage = document.getElementById("temperatureMessage");
const searchBar = document.getElementById("searchBar");
const submitBtn = document.getElementById("submitBtn");


submitBtn.addEventListener("click", () => {

    let searchInput = searchBar.value.toLowerCase();
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchInput + '&appid=' + Data.key)
        .then(response => response.json())
        .then(data => {
            const mainTag = document.getElementsByTagName("main")[0];
            for (let i = 0; i< data.list.length; i++) {
            console.log(data.list.length);
            const newDate = document.createElement("p");
            newDate.innerHTML = data.list[i].dt_txt;
            mainTag.appendChild(newDate);
            const temperatureParagraph = document.createElement("p");
            temperatureParagraph.innerHTML = data.list[i].main.temp-273.15;
            mainTag.appendChild(temperatureParagraph);
            // dateMessage.innerHTML = data.list[0].dt_txt;
            // temperatureMessage.innerHTML = data.list[0].main.temp-273.15;
        }});

});
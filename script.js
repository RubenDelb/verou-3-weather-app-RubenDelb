import Data from "/config.js";

const searchBar = document.getElementById("searchBar");
const submitBtn = document.getElementById("submitBtn");
const mainTag = document.getElementsByTagName("main")[0];
const imgDiv = document.getElementById("imgDiv");

submitBtn.addEventListener("click", () => {
    mainTag.innerHTML = ""; //Make sure the previous searchresults will disappear
    let searchInput = searchBar.value.toLowerCase();
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchInput + '&appid=' + Data.key)
        .then(response => response.json())
        .then(data => {
            const lat = data.city.coord.lat;
            console.log(lat);
            const long = data.city.coord.lon;
            console.log(long);
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+long+'&exclude=minutely,hourly&appid='+ Data.key)
            .then(response => response.json())
            .then(result => {
                console.log(result);
            })
            console.log(data);
            for (let i = 0; i < data.list.length; i++) {
                //
                const newDate = document.createElement("p");
                newDate.innerHTML = data.list[i].dt_txt;
                if (newDate.innerHTML.includes("15:00:00") || newDate.innerHTML.includes("03:00:00")) {
                    mainTag.append(newDate);

                    const temperatureParagraph = document.createElement("p");
                    temperatureParagraph.innerHTML = Math.round(data.list[i].main.temp - 273.15) + "°C" + " " + data.list[i].weather[0].description;
                    mainTag.append(temperatureParagraph);

                    const newDiv = document.createElement("div");
                    newDiv.className = "imageDiv";
                    mainTag.appendChild(newDiv);

                    
                    const weatherImage = document.createElement("img");
                    weatherImage.src = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
                    newDiv.appendChild(weatherImage);
                    const windArrow = document.createElement("img");
                    windArrow.src = "/images/up-arrow-svgrepo-com.svg";
                    windArrow.className = "windArrow"
                    windArrow.style.transform = "rotate3d(0, 0, 1, " +data.list[i].wind.deg+"deg)";
                    newDiv.appendChild(windArrow);
                }
            }
            // for (let i = 8; i< 16; i++) {
            //         const newDate = document.createElement("p");
            //         newDate.innerHTML = data.list[i].dt_txt;
            //         if (newDate.innerHTML.includes("15:00:00")) {
            //         mainTag.appendChild(newDate);
            //         const temperatureParagraph = document.createElement("p");
            //         temperatureParagraph.innerHTML = Math.round(data.list[i].main.temp-273.15) + "°C" + " " + data.list[i].weather[0].description;
            //         mainTag.appendChild(temperatureParagraph);
            //         const weatherImage = document.createElement("img");
            //         weatherImage.src = "http://openweathermap.org/img/wn/"+data.list[i].weather[0].icon + "@2x.png";
            //         mainTag.appendChild(weatherImage);}
            // }
        });
});
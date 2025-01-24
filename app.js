document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector("#search");
  const btn = document.querySelector("#btn");
  const day = document.querySelector(".day");
  const date = document.querySelector(".date");
  const time = document.querySelector(".time");
  const mainImg = document.querySelector(".condition_img");
  const subImg = document.querySelector(".sub_condition_img");
  const tempImg = document.querySelector(".current_temp_img");
  const condText = document.querySelector(".condition_text");
  const temp = document.querySelector(".temp");
  const hoursDiv = document.querySelector(".hours");
  const wind = document.querySelector(".wind");
  const pressure = document.querySelector(".pressure");
  const humidity = document.querySelector(".humidity");
  const hourlyForecast = document.querySelector(".next_23_hours");
  const loader = document.querySelector(".loader");
  const dailyForecast = document.querySelector(".daily_forecast");
  const mapLayer = document.getElementById("map");
  const content = document.querySelector(".main_content");
  const feelsLike = document.querySelector(".feelslike_text");
  console.log(content);
  const regionState = document.querySelector(".region_state");
  const cloud = document.querySelector(".cloud");
  const country = document.querySelector(".country");
  btn.addEventListener("click", fetchData);
  btn.click();

  let map = L.map("map", {
    dragging: false,
  }).setView([51.505, -0.09], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
  let currentMarker = L.marker([51.505, -0.09]).addTo(map);
  L.Control.geocoder({
    defaultMarkGeocode: true,
  }).addTo(map);

  function fetchData() {
    loader.classList.toggle("show");
    content.classList.add("hide");
    fetch(
      `https://web-production-4557a.up.railway.app?client_port=${window.location.port}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: search.value,
      }
    )
      .then((response) => {
        loader.classList.toggle("show");

        if (response.ok) {
          if (response.headers.get("Content-Type") === "application/json") {
            return response.json();
          } else {
            return response.text();
          }
        }
      })
      .then((data) => {
        console.log(data);
        let hourlyForecastData = data.forecaste_response.forecast.forecastday;
        let weather = data.current_response.current;
        let location = data.current_response.location;
        let lat = data.forecaste_response.location.lat;
        let lon = data.forecaste_response.location.lon;
        setCordinates(lat, lon);
        setWeatherAndCityName(weather, location);
        populateAirCondition(weather);
        createHourlyDiv(hourlyForecastData);
        content.classList.remove("hide");
      })
      .catch((error) => {
        console.error("Failed to fetch:", error);
      });
    //content.classList.toggle('show')
  }

  function setCordinates(lat, lon) {
    if (currentMarker) {
      map.removeLayer(currentMarker);
    }
    map.setView([lat, lon]);
    currentMarker = L.marker([lat, lon]).addTo(map);
  }

  function setWeatherAndCityName(wData, lData) {
    const dateTime = new Date();
    let numOfDay = dateTime.getDay();
    let dateNum = dateTime.getDate();
    let hours = dateTime.getHours();
    console.log(hours);
    let minutes = dateTime.getMinutes();
    let hrmn;
    let amPM = hours > 12 ? "PM" : "AM";
    hrmn = `${hours}:${minutes <= 9 ? "0" + minutes : minutes}${amPM}`;
    days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    let currentDay = days[numOfDay];
    day.textContent = currentDay;
    date.textContent = dateNum;
    time.textContent = hrmn;
    mainImg.src = wData.condition.icon;
    subImg.src = wData.condition.icon;
    tempImg.src = wData.condition.icon;
    condText.textContent = wData.condition.text;
    feelsLike.textContent = `Feels like ${Math.floor(wData.feelslike_c)}° ${
      Math.floor(wData.feelslike_c) - 2
    }°/${Math.floor(wData.temp_c) - 2}° `;
    //set temperature
    temp.textContent = `${wData.temp_c}°C`;
    country.textContent = lData.country;
    console.log(lData.country);
    regionState.textContent = lData.region;
  }

  function populateAirCondition(data) {
    wind.textContent = data.windchill_c;
    console.log(data.windchill_c);
    pressure.textContent = data.pressure_in + "%";
    humidity.textContent = data.humidity + "%";
    cloud.textContent = data.cloud;
  }

  function createHourlyDiv(data) {
    console.log("ok");
    while (hourlyForecast.firstChild) {
      hourlyForecast.removeChild(hourlyForecast.firstChild);
    }
    for (i = 0; i < data[0].hour.length - 1; i++) {
      const hourlyDiv = document.createElement("div");
      hourlyForecast.appendChild(hourlyDiv);
    }
    const childDivs = hourlyForecast.querySelectorAll(".next_23_hours >*");
    childDivs.forEach((hour, index) => {
      if (data[0].hour[index]) {
        const temp = document.createElement("span");
        const img = document.createElement("img");
        const time = document.createElement("span");
        temp.textContent = `${data[0].hour[index].temp_c}°c`;
        img.src = data[0].hour[index].condition.icon;
        index = index === 0 ? index + 1 : index;
        const timeString = data[0].hour[index].time;
        const splitTime = timeString.split(" ");
        time.textContent = splitTime[1];

        hour.appendChild(temp);
        hour.appendChild(img);
        hour.appendChild(time);
      }
    });
  }
});

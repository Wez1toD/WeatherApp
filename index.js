const cont_all = document.querySelector(".weather_section__container");

// Weather Search
const form = document.querySelector(
    ".weather_section__container__c_search form"
);
const location_city = document.querySelector("#city");
const location_weather_title = document.querySelector(
    ".weather_section__container__weather_title h3"
);
const location_hour = document.getElementById("location_hour");

// Weather Information
const weather_icon = document.getElementById("weather_icon");
const weather_desc = document.getElementById("weather_desc");
const temp_element = document.getElementById("temp");
const max_temp_element = document.getElementById("max_temp");
const min_temp_element = document.getElementById("min_temp");
const humidity_element = document.getElementById("humidity");
const wind_element = document.getElementById("wind");

// Api
const api_key = "f5cc49084f518796e4a8498e84c4361a";

// Clock
const time_ss = document.getElementById("time_ss");
const time_mm = document.getElementById("time_mm");
const time_hh = document.getElementById("time_hh");
const sec_dot = document.querySelector(".sec_dot");
const min_dot = document.querySelector(".min_dot");
const hour_dot = document.querySelector(".hour_dot");
const niddle_ss = document.getElementById("niddle_ss");
const niddle_mm = document.getElementById("niddle_mm");
const niddle_hh = document.getElementById("niddle_hh");

let timezone_offset = 0;

const time_am = document.getElementById("time_am");
const time_pm = document.getElementById("time_pm");

// Search autocomplete
const result_box = document.getElementById("result_box");

// Form Function
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (location_city.value == "") {
        ShowError("No se ha ingresado un lugar.");
        return;
    }

    let location_name = location_city.value;
    GetWeather(location_name);
});
function ShowError(message) {
    Swal.fire({
        icon: "error",
        title: "Rayos...",
        text: message,
        color: "#ddd",
    });
}

function GetWeather(location_name) {
    cont_all.classList.add("loading");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location_name}&appid=${api_key}&units=metric&lang=es`;
    fetch(url)
        .then((data) => {
            return data.json();
        })
        .then((dataJSON) => {
            if (dataJSON.cod == "404") {
                cont_all.classList.remove("loading");
                ShowError("Ciudad no encontrada.");
                return;
            }
            setTimeout(() => {
                cont_all.classList.remove("loading");
            }, 400);
            showWeather(dataJSON);
        });
}
function showWeather(data) {
    const {
        name,
        main: { temp, temp_min, temp_max, humidity },
        weather: [arr],
        sys: { country },
        timezone,
        wind: { speed },
    } = data;

    location_weather_title.textContent = name + ", " + country;
    location_hour.textContent = name + ", " + country;
    location_city.value = "";
    result_box.innerHTML = "";

    timezone_offset = timezone;

    weather_description_data =
        arr.description.charAt(0).toUpperCase() + arr.description.slice(1);

    if (weather_icon.classList.contains("d-none"))
        weather_icon.classList.remove("d-none");

    weather_icon.src = `https://openweathermap.org/img/wn/${arr.icon}@2x.png`;
    weather_icon.alt = weather_description_data;
    weather_icon.title = weather_description_data;

    weather_desc.textContent = weather_description_data;
    temp_element.textContent = temp;
    max_temp_element.textContent = temp_max;
    min_temp_element.textContent = temp_min;
    humidity_element.textContent = humidity;
    wind_element.textContent = speed;
}

// Time
setInterval(() => {
    let s = new Date().getUTCSeconds();
    let m = new Date().getUTCMinutes();
    let h = new Date().getUTCHours();

    time_ss.style.strokeDashoffset = 760 - (760 * s) / 60;
    // 60 seconds
    time_mm.style.strokeDashoffset = 630 - (630 * m) / 60;
    // 60 minutes

    h += timezone_offset / 3600;

    // Conditions limits
    if (h > 24) {
        h %= 24;
    }
    if (h < 0) {
        h = 24 + h;
    }

    //To convert 24h format to 12h format
    if (h > 12) {
        h %= 12;
        time_pm.classList.add("active");
        time_am.classList.remove("active");
    } else {
        time_am.classList.add("active");
        time_pm.classList.remove("active");
    }
    time_hh.style.strokeDashoffset = 510 - (510 * h) / 12;
    // 12 hours

    sec_dot.style.transform = `rotateZ(${s * 6}deg)`;
    min_dot.style.transform = `rotateZ(${m * 6}deg)`;
    hour_dot.style.transform = `rotateZ(${h * 30}deg)`;

    niddle_ss.style.transform = `rotateZ(${s * 6}deg)`;
    niddle_mm.style.transform = `rotateZ(${m * 6}deg)`;
    niddle_hh.style.transform = `rotateZ(${h * 30}deg)`;
});

// Search Autocomplete
function SearchAutocomplete() {
    let results = [];
    let location_name = location_city.value;
    if (location_name.length) {
        results = arrayLocations.filter((keyword) => {
            return keyword.toLowerCase().includes(location_name.toLowerCase());
        });
    }
    DisplayAutoComplete(results);
    if (!results.length) {
        result_box.innerHTML = "";
    }
}
location_city.addEventListener("keyup", SearchAutocomplete);
window.addEventListener("click", function (e) {
    if (!form.contains(e.target)) {
        result_box.innerHTML = "";
    }
});
location_city.addEventListener("click", SearchAutocomplete);

function DisplayAutoComplete(result) {
    const content = [];

    for (let i = 0; i < 10; i++) {
        const element = result[i];
        if (element) {
            content.push("<li onclick=SelectOption(this)>" + element + "</li>");
        }
    }

    result_box.innerHTML = "<ul>" + content.join("") + "</ul>";
}
function SelectOption(element) {
    result_box.innerHTML = "";
    GetWeather(element.textContent);
}

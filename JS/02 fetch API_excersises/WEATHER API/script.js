const cityInput = document.querySelector('#city');
const citySearchBtn = document.querySelector('#search');
const weatherBox = document.querySelector('#weather_container');

const showWeather = weather => {
    const weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    
    const temperature = document.createElement('h1');
    temperature.innerText = weather.main.temp;
    
    const feelsTemperature = document.createElement('h2');
    feelsTemperature.innerText = weather.main.feels_like;

    const wind = document.createElement('h2');
    wind.innerText = weather.wind.speed;

    const weatherDescription = document.createElement('p');
    weatherDescription.innerText = weather.weather[0].description;

    weatherBox.append(weatherIcon, temperature, feelsTemperature, wind, weatherDescription);
}

const showError = () => {
    weatherBox.innerText = 'Nie znaleziono podanej miejscowości';
}

const searchWeather = async () => {
    const connectApi = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=dba3cbbbe22de845daba54e9ad2c2c0b&units=metric&lang=pl`);
    const response = await connectApi.json();

    weatherBox.innerHTML = '';

    response.cod === '404' ? showError() : showWeather(response);
    
}
citySearchBtn.addEventListener('click', searchWeather);


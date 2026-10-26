// Kod wygenerowany za pomoca CODEX
class WeatherApp {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.form = document.getElementById("weatherForm");
    this.cityInput = document.getElementById("city");
    this.currentWeather = document.getElementById("currentWeather");
    this.forecast = document.getElementById("forecast");

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.fetchWeather();
    });
  }

  fetchWeather() {
    const city = this.cityInput.value.trim();

    if (city === "") {
      alert("Wpisz nazwę miasta!");
      return;
    }

    this.currentWeather.innerHTML = "<p>Ładowanie aktualnej pogody...</p>";
    this.forecast.innerHTML = "<p>Ładowanie prognozy...</p>";

    const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q="
      + encodeURIComponent(city) + "&appid=" + this.apiKey + "&units=metric&lang=pl";

    const request = new XMLHttpRequest();
    request.open("GET", weatherUrl, true);

    request.onload = () => {
      if (request.status === 200) {
        const weatherData = JSON.parse(request.responseText);
        console.log("Aktualna pogoda:", weatherData);
        this.displayCurrentWeather(weatherData);
      } else {
        this.currentWeather.innerHTML = "<p>Nie udało się pobrać pogody. Sprawdź nazwę miasta.</p>";
      }
    };

    request.onerror = () => {
      this.currentWeather.innerHTML = "<p>Błąd połączenia z serwerem.</p>";
    };

    request.send();

    const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
      + encodeURIComponent(city) + "&appid=" + this.apiKey + "&units=metric&lang=pl";

    fetch(forecastUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Błąd pobierania prognozy");
        }
        return response.json();
      })
      .then((weatherData) => {
        console.log("Prognoza pogody:", weatherData);
        this.displayForecast(weatherData);
      })
      .catch((error) => {
        console.log(error);
        this.forecast.innerHTML = "<p>Nie udało się pobrać prognozy.</p>";
      });
  }

  displayCurrentWeather(weatherData) {
    const temperature = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const animations = {
      '01d': 'day', '01n': 'night',
      '02d': 'cloudy-day-1', '02n': 'cloudy-night-1',
      '03d': 'cloudy-day-3', '03n': 'cloudy-night-3',
      '04d': 'cloudy', '04n': 'cloudy',
      '09d': 'rainy-6', '09n': 'rainy-6',
      '10d': 'rainy-3', '10n': 'rainy-5',
      '11d': 'thunder', '11n': 'thunder',
      '13d': 'snowy-3', '13n': 'snowy-5',
      '50d': 'cloudy', '50n': 'cloudy'
    };
    const animation = animations[icon] || 'cloudy';

    this.currentWeather.innerHTML = `
          <div class="card current">
              <div>
                  <h2>Teraz: ${weatherData.name}</h2>
                  <p class="temperature">${temperature}°C</p>
                  <p>${description}</p>
                  <p>Odczuwalna: ${feelsLike}°C</p>
              </div>
              <figure class="weather-animation">
                  <img src="https://www.amcharts.com/lib/images/weather/animated/${animation}.svg"
                       alt="${description}" width="160" height="160">
              </figure>
          </div>
      `;

    this.currentWeather.querySelector('.weather-animation img').addEventListener('error', function() {
      this.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }, { once: true });
  }

  displayForecast(weatherData) {
    this.forecast.innerHTML = "<h2>Prognoza na 5 dni (co 3 godziny)</h2><div id='cards' class='grid'></div>";
    const cards = document.getElementById("cards");

    weatherData.list.forEach(function(forecastEntry) {
      const date = new Date(forecastEntry.dt * 1000).toLocaleString("pl-PL", {
        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
      });
      const temperature = Math.round(forecastEntry.main.temp);
      const feelsLike = Math.round(forecastEntry.main.feels_like);
      const description = forecastEntry.weather[0].description;
      const icon = forecastEntry.weather[0].icon;

      cards.innerHTML += `
              <div class="card">
                  <h3>${date}</h3>
                  <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Ikona pogody">
                  <p class="temperature-small">${temperature}°C</p>
                  <p>${description}</p>
                  <p>Odczuwalna: ${feelsLike}°C</p>
              </div>
          `;
    });
  }
}

const weatherApp = new WeatherApp("1977755dc8b77ef890088a95f8f9ea79");

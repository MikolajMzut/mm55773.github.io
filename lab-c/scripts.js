const apiKey = "1977755dc8b77ef890088a95f8f9ea79";

const poleMiasto = document.getElementById("miasto");
const przycisk = document.getElementById("przycisk");
const aktualnaPogoda = document.getElementById("aktualnaPogoda");
const prognoza = document.getElementById("prognoza");

przycisk.addEventListener("click", pobierzPogode);

poleMiasto.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    pobierzPogode();
  }
});

function pobierzPogode() {
  const miasto = poleMiasto.value.trim();

  if (miasto === "") {
    alert("Wpisz nazwę miasta!");
    return;
  }

  aktualnaPogoda.innerHTML = "<p>Ładowanie aktualnej pogody...</p>";
  prognoza.innerHTML = "<p>Ładowanie prognozy...</p>";

  const adresPogody = "https://api.openweathermap.org/data/2.5/weather?q="
    + encodeURIComponent(miasto) + "&appid=" + apiKey + "&units=metric&lang=pl";

  const zapytanie = new XMLHttpRequest();
  zapytanie.open("GET", adresPogody, true);

  zapytanie.onload = function() {
    if (zapytanie.status === 200) {
      const dane = JSON.parse(zapytanie.responseText);
      console.log("Aktualna pogoda:", dane);
      pokazAktualnaPogode(dane);
    } else {
      aktualnaPogoda.innerHTML = "<p>Nie udało się pobrać pogody. Sprawdź nazwę miasta.</p>";
    }
  };

  zapytanie.onerror = function() {
    aktualnaPogoda.innerHTML = "<p>Błąd połączenia z serwerem.</p>";
  };

  zapytanie.send();

  const adresPrognozy = "https://api.openweathermap.org/data/2.5/forecast?q="
    + encodeURIComponent(miasto) + "&appid=" + apiKey + "&units=metric&lang=pl";

  fetch(adresPrognozy)
    .then(function(odpowiedz) {
      if (!odpowiedz.ok) {
        throw new Error("Błąd pobierania prognozy");
      }
      return odpowiedz.json();
    })
    .then(function(dane) {
      console.log("Prognoza pogody:", dane);
      pokazPrognoze(dane);
    })
    .catch(function(blad) {
      console.log(blad);
      prognoza.innerHTML = "<p>Nie udało się pobrać prognozy.</p>";
    });
}

function pokazAktualnaPogode(dane) {
  const temperatura = Math.round(dane.main.temp);
  const odczuwalna = Math.round(dane.main.feels_like);
  const opis = dane.weather[0].description;
  const ikona = dane.weather[0].icon;
  const animacje = {
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
  const animacja = animacje[ikona] || 'cloudy';

  aktualnaPogoda.innerHTML = `
        <div class="karta aktualna">
            <div>
                <h2>Teraz: ${dane.name}</h2>
                <p class="temperatura">${temperatura}°C</p>
                <p>${opis}</p>
                <p>Odczuwalna: ${odczuwalna}°C</p>
            </div>
            <figure class="animacja-pogody">
                <img src="https://www.amcharts.com/lib/images/weather/animated/${animacja}.svg"
                     alt="${opis}" width="160" height="160">
            </figure>
        </div>
    `;

  aktualnaPogoda.querySelector('.animacja-pogody img').addEventListener('error', function() {
    this.src = `https://openweathermap.org/img/wn/${ikona}@2x.png`;
  }, { once: true });
}

function pokazPrognoze(dane) {
  prognoza.innerHTML = "<h2>Prognoza na 5 dni (co 3 godziny)</h2><div id='karty' class='siatka'></div>";
  const karty = document.getElementById("karty");

  dane.list.forEach(function(element) {
    const data = new Date(element.dt * 1000).toLocaleString("pl-PL", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
    });
    const temperatura = Math.round(element.main.temp);
    const odczuwalna = Math.round(element.main.feels_like);
    const opis = element.weather[0].description;
    const ikona = element.weather[0].icon;

    karty.innerHTML += `
            <div class="karta">
                <h3>${data}</h3>
                <img src="https://openweathermap.org/img/wn/${ikona}@2x.png" alt="Ikona pogody">
                <p class="temperatura-mala">${temperatura}°C</p>
                <p>${opis}</p>
                <p>Odczuwalna: ${odczuwalna}°C</p>
            </div>
        `;
  });
}


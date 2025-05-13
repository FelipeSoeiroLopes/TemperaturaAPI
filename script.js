const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSelection = document.querySelector('.weather-info');
const notFoundSelection = document.querySelector('.not-found');
const searchCitySelection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt'); 

const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = '5d05ca008223ba940fc64e29c7105a73';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != ''){
        updateWeather(cityInput.value)
        cityInput.value = '';
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && 
    cityInput.value.trim() != ''
    ){
        updateWeather(cityInput.value)
        cityInput.value = '';
        cityInput.blur()
    }
})

async function getfetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl)

    return response.json()
}

function getWeatherIcon(id){
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

// Tradução das condições climáticas
const weatherTranslations = {
    'Clear': 'Limpo',
    'Clouds': 'Nublado',
    'Rain': 'Chuva',
    'Drizzle': 'Chuvisco',
    'Thunderstorm': 'Tempestade',
    'Snow': 'Neve',
    'Mist': 'Neblina',
    'Fog': 'Névoa'
};

// Melhorar a função getCurrentDate para formato brasileiro completo
function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'long', // 'short' para 'long' para mostrar o dia completo
        day: '2-digit',
        month: 'long' // 'short' para 'long' para mostrar o mês completo
    }
    return currentDate.toLocaleDateString('pt-BR', options)
}

async function updateWeather(city){
    const weatherData = await getfetchData('weather', city);

    if (weatherData.cod != 200){
        showDisplaySelection(notFoundSelection)
        return
    }

    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: { speed }
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = `${Math.round(temp)}°C`
    conditionTxt.textContent = weatherTranslations[main] || main
    humidityValueTxt.textContent = `${humidity}%`
    windValueTxt.textContent = `${speed.toFixed(1)} km/h` // Convertendo para km/h para melhor compreensão

    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `./assets/weather/${getWeatherIcon(id)}`
    
    await updateForecastInfo(city)
    showDisplaySelection(weatherInfoSelection)
}

async function updateForecastInfo(city){
    const forecastsData = await getfetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && 
            !forecastWeather.dt_txt.includes(todayDate)){ 
            updateForecastItems(forecastWeather)
        }
    })
}

// Completar a função updateForecastItems que estava incompleta
function updateForecastItems(weatherData){
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const forecastItem = document.createElement('div')
    forecastItem.classList.add('forecast-item')
    
    // Formatando a data para o padrão brasileiro
    const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long'
    })

    forecastItem.innerHTML = `
        <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
        <img src="./assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
    `
    
    forecastItemsContainer.appendChild(forecastItem)
}

function showDisplaySelection(section){
    [weatherInfoSelection, searchCitySelection, notFoundSelection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}
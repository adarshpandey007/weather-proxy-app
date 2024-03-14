const weatherDisplay = document.querySelector('.weather')
const weatherForm = document.querySelector('#weather-form')
const cityInput = document.querySelector('#city-input')

// Fetch weather data from API
const fetchWeather = async (city) => {
    const url = `/api?q=${city}`
    console.log('Fetching weather data for city:', city);
    const res = await fetch(url)
    const data = await res.json()
    // console.log(data);
    if (data.cod === '404') {
      alert('City not found')
      return
    }
  
    if (data.cod === 401) {
      alert('Invalid API Key')
      return
    }
    // console.log(data);
    const displayData = {
      city: data[0].weather.city,
      temp: kelvinToFahrenheit(data[0].weather.temp),
    }
  
    addWeatherToDOM(displayData)
  }
  

// Add display data to DOM
const addWeatherToDOM = (data) => {
  weatherDisplay.innerHTML = `
    <h1>Weather in ${data.city}</h1>
    <h2>${data.temp} &deg;F</h2>
  `
  cityInput.value = ''
}

// Convert Kelvin to Fahrenheit
const kelvinToFahrenheit = (temp) => {
  return Math.ceil(((temp - 273.15) * 9) / 5 + 32)
}

// Event listener for form submission
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (cityInput.value === '') {
    alert('Please enter a city')
  } else {
    fetchWeather(cityInput.value)
  }
})

// Initial fetch
fetchWeather('London') 
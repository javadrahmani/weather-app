import { useState, useCallback } from 'react'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE    = 'https://api.openweathermap.org/data/2.5'

export function useWeather() {
  const [weather,  setWeather]  = useState(null)
  const [forecast, setForecast] = useState([])
  const [status,   setStatus]   = useState('idle')

  const fetchWeather = useCallback(async (city) => {
    if (!city.trim()) return
    setStatus('loading')
    setWeather(null)
    setForecast([])

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
      ])

      if (currentRes.status === 404) { setStatus('empty'); return }
      if (!currentRes.ok || !forecastRes.ok) { setStatus('error'); return }

      const currentData  = await currentRes.json()
      const forecastData = await forecastRes.json()

      // sunrise/sunset in local time
      const sunrise = currentData.sys.sunrise
      const sunset  = currentData.sys.sunset
      const now     = currentData.dt
      const isDay   = now >= sunrise && now <= sunset

      setWeather({
        city:        currentData.name,
        country:     currentData.sys.country,
        temp:        Math.round(currentData.main.temp),
        feelsLike:   Math.round(currentData.main.feels_like),
        tempMax:     Math.round(currentData.main.temp_max),
        tempMin:     Math.round(currentData.main.temp_min),
        humidity:    currentData.main.humidity,
        pressure:    currentData.main.pressure,
        windSpeed:   Math.round(currentData.wind.speed * 3.6),
        windDir:     getWindDir(currentData.wind.deg),
        visibility:  currentData.visibility ? (currentData.visibility / 1000).toFixed(1) : '—',
        description: currentData.weather[0].description,
        condition:   currentData.weather[0].main,
        iconId:      currentData.weather[0].id,
        uvIndex:     0,
        isDay,
      })

      // 5-day forecast
      const dailyMap = {}
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000)
        const day  = date.toLocaleDateString('en-US', { weekday: 'short' })
        const hour = date.getHours()
        if (!dailyMap[day]) {
          dailyMap[day] = {
            day, dt: item.dt,
            tempMax: item.main.temp_max, tempMin: item.main.temp_min,
            condition: item.weather[0].main, iconId: item.weather[0].id,
            description: item.weather[0].description,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            windDir: getWindDir(item.wind.deg),
            pressure: item.main.pressure,
            feelsLike: Math.round(item.main.feels_like),
            visibility: item.visibility ? (item.visibility/1000).toFixed(1) : '—',
          }
        } else {
          if (item.main.temp_max > dailyMap[day].tempMax) dailyMap[day].tempMax = item.main.temp_max
          if (item.main.temp_min < dailyMap[day].tempMin) dailyMap[day].tempMin = item.main.temp_min
          if (hour === 12) {
            dailyMap[day].condition   = item.weather[0].main
            dailyMap[day].iconId      = item.weather[0].id
            dailyMap[day].description = item.weather[0].description
            dailyMap[day].humidity    = item.main.humidity
            dailyMap[day].windSpeed   = Math.round(item.wind.speed * 3.6)
            dailyMap[day].windDir     = getWindDir(item.wind.deg)
            dailyMap[day].feelsLike   = Math.round(item.main.feels_like)
          }
        }
      })

      const days = Object.values(dailyMap).slice(0, 6).map(d => ({
        ...d,
        tempMax: Math.round(d.tempMax),
        tempMin: Math.round(d.tempMin),
      }))

      setForecast(days)
      setStatus('data')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }, [])

  return { weather, forecast, status, fetchWeather }
}

function getWindDir(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}

export function getWeatherEmoji(id) {
  if (!id) return '🌡️'
  if (id >= 200 && id < 300) return '⛈️'
  if (id >= 300 && id < 400) return '🌦️'
  if (id >= 500 && id < 600) return id >= 502 ? '🌧️' : '🌧️'
  if (id >= 600 && id < 700) return '❄️'
  if (id >= 700 && id < 800) return '🌫️'
  if (id === 800)             return '☀️'
  if (id === 801)             return '🌤️'
  if (id === 802)             return '⛅'
  if (id >= 803)              return '☁️'
  return '🌡️'
}

// Dynamic gradient based on condition + day/night
export function getBackground(condition, isDay) {
  if (!isDay) {
    // Night — always dark blue/purple
    switch(condition) {
      case 'Thunderstorm': return 'linear-gradient(160deg,#0a0a1a 0%,#1a0a2e 40%,#0d0d20 100%)'
      case 'Rain':
      case 'Drizzle':      return 'linear-gradient(160deg,#0d1520 0%,#1a2535 40%,#0a1525 100%)'
      case 'Snow':         return 'linear-gradient(160deg,#1a1f2e 0%,#252d3d 40%,#1a2030 100%)'
      default:             return 'linear-gradient(160deg,#080e1a 0%,#0d1829 35%,#0a1f38 70%,#061428 100%)'
    }
  }
  // Day
  switch(condition) {
    case 'Thunderstorm': return 'linear-gradient(160deg,#2c2c4e 0%,#3d2d5e 40%,#1a1a3e 100%)'
    case 'Drizzle':
    case 'Rain':         return 'linear-gradient(160deg,#3a5a7a 0%,#4a7a9b 40%,#2a4a6a 100%)'
    case 'Snow':         return 'linear-gradient(160deg,#c8ddef 0%,#a8c8e8 50%,#8ab8d8 100%)'
    case 'Mist':
    case 'Fog':
    case 'Haze':
    case 'Dust':
    case 'Sand':
    case 'Smoke':        return 'linear-gradient(160deg,#8a9aaa 0%,#9aaaba 50%,#7a8a9a 100%)'
    case 'Clear':        return 'linear-gradient(160deg,#f7c948 0%,#f0a020 30%,#e06010 60%,#c84010 100%)'
    case 'Clouds':       return 'linear-gradient(160deg,#b8d8f5 0%,#85b8e0 30%,#5a9ac8 60%,#4a8dbf 100%)'
    default:             return 'linear-gradient(160deg,#b8d8f5 0%,#85b8e0 50%,#5a9ac8 100%)'
  }
}

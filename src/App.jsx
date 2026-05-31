import { useState, useEffect, useRef } from 'react'
import { useWeather, getBackground } from './hooks/useWeather'
import Navbar from './components/Navbar'
import MainCard from './components/MainCard'
import StatsRow from './components/StatsRow'
import ForecastCard from './components/ForecastCard'
import { LoadingState, ErrorState, EmptyState } from './components/StateViews'

export default function App() {
  const [dark, setDark]               = useState(false)
  const [time, setTime]               = useState('')
  const [selectedDay, setSelectedDay] = useState(null)
  const { weather, forecast, status, fetchWeather } = useWeather()
  const rainRef  = useRef(null)
  const starsRef = useRef(null)
  const lastCity = useRef('London')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setTime(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick,1000); return () => clearInterval(id)
  }, [])

  useEffect(() => { fetchWeather('London') }, [])

  // reset selected day on new search
  useEffect(() => { setSelectedDay(null) }, [weather])

  useEffect(() => {
    if (!rainRef.current) return
    rainRef.current.innerHTML = ''
    for (let i = 0; i < 50; i++) {
      const d = document.createElement('div')
      const h = Math.random()*80+20
      Object.assign(d.style, {
        position:'absolute', width:'1px', height:`${h}px`,
        left:`${Math.random()*100}%`, top:`-${h}px`,
        background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.7))',
        animation:`fall ${Math.random()*.6+.5}s linear ${Math.random()*2}s infinite`,
      })
      rainRef.current.appendChild(d)
    }
  }, [])

  useEffect(() => {
    if (!starsRef.current) return
    starsRef.current.innerHTML = ''
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div')
      const sz = Math.random()*2+1
      Object.assign(s.style, {
        position:'absolute', width:`${sz}px`, height:`${sz}px`,
        left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
        background:'#fff', borderRadius:'50%',
        animation:`twinkle ${Math.random()*3+2}s ease-in-out ${Math.random()*4}s infinite`,
      })
      starsRef.current.appendChild(s)
    }
  }, [])

  const handleSearch  = (city) => { lastCity.current = city; fetchWeather(city) }
  const handleRetry   = () => fetchWeather(lastCity.current)
  const handleMode    = (mode) => setDark(mode === 'dark')

  // Active display: selected forecast day OR current weather
  const activeForecast = selectedDay !== null ? forecast[selectedDay] : null

  // Background: if dark → always night, else use condition+isDay
  const condition = activeForecast ? activeForecast.condition : (weather?.condition || 'Clouds')
  const isDay     = dark ? false : (weather?.isDay ?? true)
  const bg        = getBackground(condition, isDay)

  // Show rain if rainy condition
  const isRainy = ['Rain','Drizzle','Thunderstorm'].includes(condition)
  // Show stars if night
  const isNight = !isDay || dark

  return (
    <div style={{ width:'100%', minHeight:'100vh', background:bg, transition:'background 0.8s ease', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column' }}>

      {/* Stars */}
      <div ref={starsRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, opacity:isNight?1:0, transition:'opacity 0.6s' }} />

      {/* Rain */}
      <div ref={rainRef} style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0, opacity:isRainy&&!dark?0.35:0, transition:'opacity 0.5s' }} />

      {/* Moon — show at night */}
      <div style={{
        position:'fixed', top:60, right:'8%',
        width:60, height:60, borderRadius:'50%',
        background:'#f0e6c8', zIndex:1, pointerEvents:'none', overflow:'hidden',
        boxShadow:'0 0 40px rgba(240,230,200,.3),0 0 80px rgba(240,230,200,.15)',
        opacity:isNight?1:0, transition:'opacity 0.6s',
      }}>
        <div style={{ position:'absolute', top:8, left:12, width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#0a1829,#0d1f38)' }} />
      </div>

      {/* Sun — show on clear day */}
      {condition === 'Clear' && isDay && !dark && (
        <div style={{
          position:'fixed', top:40, right:'12%', zIndex:1, pointerEvents:'none',
          width:80, height:80, borderRadius:'50%',
          background:'radial-gradient(circle,#ffe066 0%,#ffb300 60%,rgba(255,180,0,0) 100%)',
          boxShadow:'0 0 60px rgba(255,200,0,.6),0 0 120px rgba(255,150,0,.3)',
          animation:'float 8s ease-in-out infinite',
        }} />
      )}

      {/* Cloud */}
      <div style={{
        position:'fixed', top:30, left:'50%', transform:'translateX(-25%)',
        width:'clamp(240px,36vw,440px)', pointerEvents:'none', zIndex:1,
        animation:'float 7s ease-in-out infinite',
        opacity: condition==='Clear'&&isDay&&!dark ? 0 : isNight ? 0.06 : 1,
        transition:'opacity 0.8s',
        filter:'drop-shadow(0 28px 48px rgba(60,120,200,.35))',
      }}>
        <svg viewBox="0 0 460 220" fill="none" width="100%">
          <defs>
            <radialGradient id="cg1" cx="50%" cy="30%" r="60%"><stop offset="0%" stopColor="#fff" stopOpacity="1"/><stop offset="100%" stopColor="#daeaf8" stopOpacity=".7"/></radialGradient>
            <radialGradient id="cg2" cx="40%" cy="25%" r="55%"><stop offset="0%" stopColor="#fff" stopOpacity=".95"/><stop offset="100%" stopColor="#c8dff2" stopOpacity=".5"/></radialGradient>
            <radialGradient id="cg3" cx="50%" cy="20%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="1"/><stop offset="100%" stopColor="#b8d4ee" stopOpacity=".4"/></radialGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <ellipse cx="130" cy="145" rx="105" ry="62" fill="#c8dff5" opacity=".6"/>
          <ellipse cx="310" cy="150" rx="115" ry="58" fill="#cce1f6" opacity=".55"/>
          <ellipse cx="220" cy="138" rx="130" ry="68" fill="#d4e7f7" opacity=".65"/>
          <ellipse cx="100" cy="130" rx="88"  ry="58" fill="#ddeef9" opacity=".8"/>
          <ellipse cx="340" cy="135" rx="95"  ry="55" fill="#deeef9" opacity=".75"/>
          <ellipse cx="230" cy="118" rx="118" ry="66" fill="url(#cg2)" opacity=".85"/>
          <ellipse cx="155" cy="112" rx="78"  ry="56" fill="url(#cg1)" opacity=".92"/>
          <ellipse cx="305" cy="115" rx="82"  ry="54" fill="url(#cg1)" opacity=".9"/>
          <ellipse cx="230" cy="98"  rx="96"  ry="62" fill="url(#cg3)"/>
          <ellipse cx="215" cy="82"  rx="68"  ry="44" fill="#fff" opacity=".95" filter="url(#glow)"/>
          <ellipse cx="235" cy="78"  rx="48"  ry="34" fill="#fff"/>
          <ellipse cx="52"  cy="148" rx="42"  ry="22" fill="#ddeef9" opacity=".55"/>
          <ellipse cx="408" cy="152" rx="38"  ry="20" fill="#ddeef9" opacity=".5"/>
        </svg>
      </div>

      {/* States */}
      {status === 'loading' && <LoadingState dark={isNight} />}
      {status === 'error'   && <ErrorState   dark={isNight} onRetry={handleRetry} />}
      {status === 'empty'   && <EmptyState   dark={isNight} />}

      <Navbar dark={isNight} onToggleMode={handleMode} onSearch={handleSearch} time={time} />

      <div style={{ position:'relative', zIndex:2, flex:1, display:'flex', flexDirection:'column', padding:'clamp(16px,2.5vw,28px)', gap:'clamp(14px,2vw,20px)', animation: status==='data' ? 'fadeIn 0.5s ease' : 'none' }}>

        {/* Top row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr clamp(200px,22vw,260px)', gap:'clamp(14px,2vw,20px)', alignItems:'start' }}>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* If a day is selected, show that day's info */}
            {activeForecast ? (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                  <div style={{ fontSize:11, background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'3px 12px', color:'#fff', fontWeight:600 }}>
                    📅 {activeForecast.day}
                  </div>
                  <button onClick={() => setSelectedDay(null)} style={{ fontSize:11, background:'transparent', border:'1px solid rgba(255,255,255,0.3)', borderRadius:20, padding:'3px 10px', color:'rgba(255,255,255,0.7)', cursor:'pointer' }}>
                    ← Back to today
                  </button>
                </div>
                <div style={{ fontSize:'clamp(32px,5vw,52px)', fontWeight:700, color:'#fff', lineHeight:1, letterSpacing:'-1.5px' }}>
                  {activeForecast.condition}
                </div>
                <div style={{ fontSize:'clamp(20px,3vw,36px)', fontWeight:300, color:'rgba(255,255,255,0.85)', marginTop:4 }}>
                  {activeForecast.description}
                </div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:10, lineHeight:1.7 }}>
                  {weather?.city}, {weather?.country} &nbsp;·&nbsp; High {activeForecast.tempMax}° &nbsp;·&nbsp; Low {activeForecast.tempMin}°
                </div>
              </div>
            ) : weather ? (
              <div>
                <div style={{ fontSize:'clamp(32px,5vw,52px)', fontWeight:700, color:'#fff', lineHeight:1, letterSpacing:'-1.5px' }}>
                  {weather.condition}
                </div>
                <div style={{ fontSize:'clamp(20px,3vw,36px)', fontWeight:300, color:'rgba(255,255,255,0.85)', marginTop:4 }}>
                  {weather.description}
                </div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:10, lineHeight:1.7 }}>
                  {weather.city}, {weather.country} &nbsp;·&nbsp; Humidity {weather.humidity}% &nbsp;·&nbsp; Wind {weather.windDir} {weather.windSpeed} km/h
                </div>
              </div>
            ) : null}

            <StatsRow weather={activeForecast || weather} dark={isNight} />
          </div>

          <MainCard weather={activeForecast ? {
            ...weather,
            temp: activeForecast.tempMax,
            feelsLike: activeForecast.feelsLike,
            tempMax: activeForecast.tempMax,
            tempMin: activeForecast.tempMin,
            description: activeForecast.description,
            iconId: activeForecast.iconId,
          } : weather} dark={isNight} />
        </div>

        <ForecastCard forecast={forecast} dark={isNight} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </div>
    </div>
  )
}

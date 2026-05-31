import { getWeatherEmoji } from '../hooks/useWeather'

export default function ForecastCard({ forecast, dark, selectedDay, onSelectDay }) {
  if (!forecast.length) return null

  return (
    <div style={{ borderRadius:20, padding:'20px 24px', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.14)', border:`1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.26)'}`, transition:'background 0.5s,border-color 0.5s' }}>

      <div style={{ fontSize:9, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'1.2px', fontWeight:600, marginBottom:14 }}>
        {forecast.length}-day forecast — <span style={{ color:'rgba(255,255,255,0.55)' }}>click a day to explore</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:`repeat(${forecast.length},1fr)`, gap:8 }}>
        {forecast.map((day, i) => {
          const isSelected = selectedDay === i
          const isToday    = i === 0
          const bg = isSelected
            ? dark ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.38)'
            : isToday
              ? dark ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.28)'
              : dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.12)'
          const border = isSelected
            ? `1px solid ${dark ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.6)'}`
            : isToday
              ? `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)'}`
              : `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)'}`

          return (
            <div
              key={day.day}
              onClick={() => onSelectDay(isSelected ? null : i)}
              style={{ borderRadius:14, padding:'12px 8px', textAlign:'center', background:bg, border, cursor:'pointer', transition:'all 0.2s', transform: isSelected ? 'translateY(-3px)' : 'none', boxShadow: isSelected ? '0 8px 24px rgba(0,0,0,0.15)' : 'none' }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.transform='none' }}
            >
              <div style={{ fontSize:9, color: isSelected||isToday ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.42)', textTransform:'uppercase', letterSpacing:'0.8px', fontWeight:600 }}>
                {isToday ? 'Today' : day.day}
              </div>
              <div style={{ fontSize:24, margin:'8px 0 6px' }}>{getWeatherEmoji(day.iconId)}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', fontFamily:'var(--font-mono)' }}>{day.tempMax}°</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.38)', marginTop:2, fontFamily:'var(--font-mono)' }}>{day.tempMin}°</div>
              <div style={{ fontSize:9, color: isSelected||isToday ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.32)', marginTop:5, lineHeight:1.3, textTransform:'capitalize' }}>
                {day.description}
              </div>
              {isSelected && (
                <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.15)', display:'flex', flexDirection:'column', gap:3 }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>💧 {day.humidity}%</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>💨 {day.windSpeed} km/h {day.windDir}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>🌡️ {day.feelsLike}°</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

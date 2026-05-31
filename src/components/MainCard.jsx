import { getWeatherEmoji } from '../hooks/useWeather'

const glass = (dark) => ({
  borderRadius: '16px',
  padding: '16px 18px',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)',
  border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.24)',
  transition: 'background 0.5s, border 0.5s',
})

export default function MainCard({ weather, dark }) {
  if (!weather) return null

  const uvPct = Math.min((weather.uvIndex / 11) * 100, 100)

  return (
    <div style={glass(dark)}>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600 }}>
        {weather.city}, {weather.country}
      </div>

      <div style={{ fontSize: '58px', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-3px', margin: '6px 0 4px' }}>
        {weather.temp}
        <sup style={{ fontSize: '20px', verticalAlign: 'top', marginTop: '12px', display: 'inline-block', fontWeight: 300 }}>°C</sup>
      </div>

      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
        {getWeatherEmoji(weather.icon)} {weather.description}
      </div>

      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
        <span style={{ color: '#ffb085' }}>↑ {weather.tempMax}°</span>
        <span style={{ color: '#93c5fd' }}>↓ {weather.tempMin}°</span>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.38)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          UV Index — {weather.uvIndex} of 10
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'linear-gradient(to right,#22c55e,#eab308,#f97316,#ef4444)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '-3px',
            width: '10px', height: '10px',
            background: '#fff', borderRadius: '50%',
            transform: 'translateX(-50%)',
            left: `${uvPct}%`,
            transition: 'left 0.5s',
          }} />
        </div>
      </div>
    </div>
  )
}

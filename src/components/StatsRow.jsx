const pill = (dark) => ({
  borderRadius: '12px',
  padding: '10px 14px',
  minWidth: '88px',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
  border: dark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(255,255,255,0.22)',
  transition: 'background 0.5s, border 0.5s',
})

function Stat({ label, value, sub, dark }) {
  return (
    <div style={pill(dark)}>
      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
        {value}
      </div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>
        {sub}
      </div>
    </div>
  )
}

export default function StatsRow({ weather, dark }) {
  if (!weather) return null

  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
      <Stat dark={dark} label="Wind"       value={`${weather.windSpeed} km/h`} sub={weather.windDir} />
      <Stat dark={dark} label="Humidity"   value={`${weather.humidity}%`}       sub="Relative" />
      <Stat dark={dark} label="Visibility" value={`${weather.visibility} km`}   sub="Distance" />
      <Stat dark={dark} label="Pressure"   value={weather.pressure}             sub="hPa" />
      <Stat dark={dark} label="Feels like" value={`${weather.feelsLike}°`}      sub="Celsius" />
    </div>
  )
}

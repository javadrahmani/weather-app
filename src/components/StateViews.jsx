const overlay = {
  position: 'absolute',
  inset: 0,
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '12px',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '16px',
  animation: 'fadeIn 0.3s ease',
}

const msg = {
  fontSize: '15px',
  color: '#fff',
  fontWeight: 600,
}

const sub = {
  fontSize: '12px',
  color: 'rgba(255,255,255,0.5)',
}

export function LoadingState({ dark }) {
  return (
    <div style={{ ...overlay, background: dark ? 'rgba(5,12,28,0.65)' : 'rgba(70,140,200,0.45)' }}>
      <div style={{
        width: '36px', height: '36px',
        border: '2px solid rgba(255,255,255,0.2)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={msg}>Fetching weather...</div>
      <div style={sub}>Connecting to OpenWeatherMap</div>
    </div>
  )
}

export function ErrorState({ dark, onRetry }) {
  return (
    <div style={{ ...overlay, background: dark ? 'rgba(5,12,28,0.65)' : 'rgba(70,140,200,0.45)' }}>
      <div style={{ fontSize: '36px' }}>⚠️</div>
      <div style={msg}>Couldn't load weather</div>
      <div style={sub}>Check your connection or API key</div>
      <button
        onClick={onRetry}
        style={{
          marginTop: '8px',
          padding: '8px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.15)',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-main)',
        }}
      >
        Try again
      </button>
    </div>
  )
}

export function EmptyState({ dark }) {
  return (
    <div style={{ ...overlay, background: dark ? 'rgba(5,12,28,0.65)' : 'rgba(70,140,200,0.45)' }}>
      <div style={{ fontSize: '36px' }}>🔍</div>
      <div style={msg}>City not found</div>
      <div style={sub}>Try a different city name</div>
    </div>
  )
}

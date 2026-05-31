import { useState } from 'react'

export default function Navbar({ dark, onToggleMode, onSearch, time }) {
  const [query, setQuery] = useState('London')

  return (
    <nav style={{
      position: 'relative', zIndex: 10,
      display: 'flex', alignItems: 'center', flexWrap: 'wrap',
      padding: '12px 24px', gap: '12px',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      background: dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.15)',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)'}`,
    }}>

      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
        <div style={{ width:28, height:28, background:'rgba(255,255,255,0.2)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🌤</div>
        <span style={{ fontSize:14, fontWeight:700, color:'#fff', letterSpacing:'0.5px' }}>WEATHER</span>
      </div>

      {/* Search */}
      <div style={{
        flex:1, maxWidth:300, margin:'0 auto',
        display:'flex', alignItems:'center', gap:8,
        borderRadius:20, padding:'7px 14px',
        background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.2)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.3)'}`,
      }}>
        <span style={{ color:'rgba(255,255,255,0.45)', flexShrink:0 }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch(query)}
          placeholder="Search city..."
          style={{ background:'transparent', border:'none', outline:'none', fontFamily:'var(--font-main)', fontSize:13, color:'#fff', width:'100%' }}
        />
      </div>

      {/* Toggle */}
      <div style={{
        display:'flex', alignItems:'center', gap:3,
        borderRadius:24, padding:4,
        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)'}`,
        flexShrink:0,
      }}>
        <button
          onClick={() => onToggleMode('light')}
          style={{
            width:32, height:32, borderRadius:16, border:'none', fontSize:15,
            cursor:'pointer', transition:'all 0.2s',
            background: !dark ? 'rgba(255,255,255,0.45)' : 'transparent',
            boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
          }}>☀️</button>
        <button
          onClick={() => onToggleMode('dark')}
          style={{
            width:32, height:32, borderRadius:16, border:'none', fontSize:15,
            cursor:'pointer', transition:'all 0.2s',
            background: dark ? 'rgba(255,255,255,0.3)' : 'transparent',
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
          }}>🌙</button>
      </div>

      {/* Clock */}
      <div style={{ fontFamily:'var(--font-mono)', fontSize:15, color:'#fff', textAlign:'right', lineHeight:1.3, flexShrink:0 }}>
        {time}
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.45)', display:'block' }}>Local time</span>
      </div>
    </nav>
  )
}

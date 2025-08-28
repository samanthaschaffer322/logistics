export default function TestCachePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #ff0000, #00ff00)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: 'white',
      fontSize: '48px',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      <h1>🔥 CACHE TEST - 2025-08-28T23:35:29</h1>
      <p style={{fontSize: '24px', marginTop: '20px'}}>
        If you can see this page, the deployment is working
      </p>
      <p style={{fontSize: '18px', marginTop: '20px'}}>
        Go to: /test-cache
      </p>
    </div>
  )
}

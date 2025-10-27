import React, { useEffect, useState } from 'react'

export default function App() {
    const [health, setHealth] = useState(null)
    const [insertMsg, setInsertMsg] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const h = await fetch('/api/health')
                const hj = await h.json()
                setHealth(hj?.status || 'unknown')

                const t = await fetch('/api/test')
                const tj = await t.json()
                setInsertMsg(tj?.message || 'N/A')
            } catch (e) {
                setError(String(e))
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <div style={{
            minHeight: '100dvh',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial'
        }}>
            <div style={{
                width: 'min(92vw, 720px)',
                borderRadius: 18,
                padding: 24,
                boxShadow: '0 8px 30px rgba(0,0,0,.12)'
            }}>
                <h1 style={{ margin: 0, fontSize: 28 }}>Image Review – Environment Check</h1>
                <p style={{ marginTop: 8, opacity: .8 }}>
                    Verifies backend reachability and a SQLite write test.
                </p>

                {loading && <p>Loading…</p>}
                {!loading && error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
                {!loading && !error && (
                    <ul style={{ lineHeight: 1.8, marginTop: 12 }}>
                        <li><strong>Backend health:</strong> {String(health)}</li>
                        <li><strong>DB insert:</strong> {String(insertMsg)}</li>
                    </ul>
                )}

                <hr style={{ margin: '16px 0', opacity: .2 }} />
                <p style={{ fontSize: 12, opacity: .65 }}>
                    Dev: Vite on :3000 proxies <code>/api</code> → <code>localhost:8000</code>.
                    Prod: Nginx serves build and proxies <code>/api</code> → <code>backend:8000</code>.
                </p>
            </div>
        </div>
    )
}
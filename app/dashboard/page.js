'use client'

export default function Dashboard() {
  const entradas = 3000
  const saidas = 1800
  const saldo = entradas - saidas

  return (
    <div style={{ padding: 40 }}>
      <h1>Painel Geral</h1>

      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <div style={{ padding: 20, border: '1px solid #ccc' }}>
          <h3>Entradas</h3>
          <p>R$ {entradas}</p>
        </div>

        <div style={{ padding: 20, border: '1px solid #ccc' }}>
          <h3>Saídas</h3>
          <p>R$ {saidas}</p>
        </div>

        <div
          style={{
            padding: 20,
            border: '1px solid #ccc',
            color: saldo >= 0 ? 'green' : 'red',
          }}
        >
          <h3>Saldo</h3>
          <p>R$ {saldo}</p>
        </div>
      </div>
    </div>
  )
}

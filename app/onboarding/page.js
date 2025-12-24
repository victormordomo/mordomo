'use client'

import { useState } from 'react'

export default function Onboarding() {
  const [tipo, setTipo] = useState('')

  return (
    <div style={{ padding: 40 }}>
      <h1>Bem-vindo ao Mordomo</h1>
      <p>Como você deseja usar o sistema?</p>

      <button onClick={() => setTipo('individual')}>
        Individual
      </button>

      <button onClick={() => setTipo('casal')} style={{ marginLeft: 10 }}>
        Casal
      </button>

      {tipo && <p>Você escolheu: {tipo}</p>}
    </div>
  )
}

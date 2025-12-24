'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()

  async function entrar() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setMensagem(error.message)
    } else {
      router.push('/onboarding')
    }
  }

  async function cadastrar() {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (error) {
      setMensagem(error.message)
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Mordomo</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <button onClick={entrar} style={{ marginRight: 10 }}>
        Entrar
      </button>

      <button onClick={cadastrar}>
        Cadastrar
      </button>

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

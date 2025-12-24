'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function entrar() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setMensagem(error.message)
      return
    }

    // ✅ REDIRECIONAMENTO GARANTIDO
    router.push('/onboarding')
  }

  async function cadastrar() {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (error) {
      setMensagem(error.message)
      return
    }

    setMensagem('Conta criada com sucesso. Agora faça login.')
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

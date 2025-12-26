'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const [tipo, setTipo] = useState(null)
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()

  async function salvarTipo(tipoEscolhido) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      tipo_conta: tipoEscolhido,
    })

    if (error) {
      setMensagem('Erro ao salvar tipo de conta')
    } else {
      setTipo(tipoEscolhido)
      setMensagem('')
    }
  }

  async function salvarNomes() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const dados =
      tipo === 'casal'
        ? { nome_1: nome1, nome_2: nome2 }
        : { nome_1: nome1 }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...dados,
    })

    if (error) {
      setMensagem('Erro ao salvar os dados')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Bem-vindo ao Mordomo</h1>

      {!tipo && (
        <>
          <p>Como você deseja usar o sistema?</p>
          <button onClick={() => salvarTipo('individual')}>
            Individual
          </button>
          <button
            onClick={() => salvarTipo('casal')}
            style={{ marginLeft: 10 }}
          >
            Casal
          </button>
        </>
      )}

      {tipo && (
        <>
          <p>Informe os nomes</p>

          <input
            placeholder="Nome"
            value={nome1}
            onChange={e => setNome1(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />

          {tipo === 'casal' && (
            <input
              placeholder="Nome do cônjuge"
              value={nome2}
              onChange={e => setNome2(e.target.value)}
              style={{ width: '100%', marginBottom: 10 }}
            />
          )}

          <button onClick={salvarNomes}>Salvar</button>
        </>
      )}

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const router = useRouter()

  const [tipoConta, setTipoConta] = useState('')
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function salvarDados() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const dados =
      tipoConta === 'casal'
        ? {
            id: user.id,
            tipo_conta: 'casal',
            nome_1: nome1,
            nome_2: nome2,
          }
        : {
            id: user.id,
            tipo_conta: 'individual',
            nome_1: nome1,
            nome_2: null,
          }

    const { error } = await supabase.from('profiles').upsert(dados)

    if (error) {
      setMensagem('Erro ao salvar os dados')
    } else {
      router.push('/dashboard')
    }
  }

  if (!tipoConta) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Bem-vindo ao Mordomo</h1>
        <p>Como você deseja usar o sistema?</p>

        <button onClick={() => setTipoConta('individual')}>
          Individual
        </button>

        <button
          onClick={() => setTipoConta('casal')}
          style={{ marginLeft: 10 }}
        >
          Casal
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Complete seus dados</h1>

      <input
        placeholder="Nome"
        value={nome1}
        onChange={e => setNome1(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      {tipoConta === 'casal' && (
        <input
          placeholder="Nome do cônjuge"
          value={nome2}
          onChange={e => setNome2(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
      )}

      <button onClick={salvarDados}>
        Salvar e continuar
      </button>

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

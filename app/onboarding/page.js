'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const router = useRouter()

  const [etapa, setEtapa] = useState('escolha')
  const [tipoConta, setTipoConta] = useState('')
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function escolher(tipo) {
    setTipoConta(tipo)
    setEtapa('nomes')
  }

  async function salvarDados() {
    setMensagem('Salvando...')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const payload =
      tipoConta === 'individual'
        ? {
            id: user.id,
            tipo_conta: 'individual',
            nome1,
            nome2: null,
          }
        : {
            id: user.id,
            tipo_conta: 'casal',
            nome1,
            nome2,
          }

    const { error } = await supabase.from('profiles').upsert(payload)

    if (error) {
      console.error(error)
      setMensagem('Erro ao salvar os dados')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Bem-vindo ao Mordomo</h1>

      {etapa === 'escolha' && (
        <>
          <p>Como você deseja usar o sistema?</p>
          <button onClick={() => escolher('individual')}>Individual</button>
          <button onClick={() => escolher('casal')} style={{ marginLeft: 10 }}>
            Casal
          </button>
        </>
      )}

      {etapa === 'nomes' && (
        <>
          <p>Informe os nomes</p>

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

          <button onClick={salvarDados}>Salvar</button>
        </>
      )}

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

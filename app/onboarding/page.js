'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const router = useRouter()

  const [etapa, setEtapa] = useState('tipo')
  const [tipoConta, setTipoConta] = useState('')
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function escolherTipo(tipo) {
    setTipoConta(tipo)
    setEtapa('nomes')
  }

  async function salvarDados() {
    setMensagem('Salvando...')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const payload =
      tipoConta === 'individual'
        ? {
            id: user.id,
            tipo_conta: 'individual',
            nome_1: nome1,
            nome_2: null,
          }
        : {
            id: user.id,
            tipo_conta: 'casal',
            nome_1: nome1,
            nome_2: nome2,
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
      {etapa === 'tipo' && (
        <>
          <h1>Bem-vindo ao Mordomo</h1>
          <p>Como você deseja usar o sistema?</p>

          <button onClick={() => escolherTipo('individual')}>
            Individual
          </button>

          <button
            onClick={() => escolherTipo('casal')}
            style={{ marginLeft: 10 }}
          >
            Casal
          </button>
        </>
      )}

      {etapa === 'nomes' && (
        <>
          <h2>Informe os nomes</h2>

          <input
            placeholder={
              tipoConta === 'individual'
                ? 'Seu nome'
                : 'Nome da primeira pessoa'
            }
            value={nome1}
            onChange={e => setNome1(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />

          {tipoConta === 'casal' && (
            <input
              placeholder="Nome da segunda pessoa"
              value={nome2}
              onChange={e => setNome2(e.target.value)}
              style={{ width: '100%', marginBottom: 10 }}
            />
          )}

          <button onClick={salvarDados}>Salvar</button>

          {mensagem && <p>{mensagem}</p>}
        </>
      )}
    </div>
  )
}

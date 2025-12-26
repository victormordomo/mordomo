'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const router = useRouter()

  const [tipo, setTipo] = useState('')
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
      tipo === 'casal'
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
          }

    const { error } = await supabase.from('profiles').upsert(dados)

    if (error) {
      setMensagem('Erro ao salvar os dados')
      return
    }

    // 🔥 REDIRECIONAMENTO GARANTIDO
    router.push('/dashboard')
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Configuração inicial</h1>

      {!tipo && (
        <>
          <p>Como você deseja usar o sistema?</p>
          <button onClick={() => setTipo('individual')}>
            Individual
          </button>
          <button
            onClick={() => setTipo('casal')}
            style={{ marginLeft: 10 }}
          >
            Casal
          </button>
        </>
      )}

      {tipo === 'individual' && (
        <>
          <p>Seu nome</p>
          <input
            value={nome1}
            onChange={e => setNome1(e.target.value)}
          />
          <br /><br />
          <button onClick={salvarDados}>
            Salvar
          </button>
        </>
      )}

      {tipo === 'casal' && (
        <>
          <p>Nome do cônjuge 1</p>
          <input
            value={nome1}
            onChange={e => setNome1(e.target.value)}
          />
          <p>Nome do cônjuge 2</p>
          <input
            value={nome2}
            onChange={e => setNome2(e.target.value)}
          />
          <br /><br />
          <button onClick={salvarDados}>
            Salvar
          </button>
        </>
      )}

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

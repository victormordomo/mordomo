'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const router = useRouter()

  const [tipoConta, setTipoConta] = useState('')
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    async function carregarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMensagem('Usuário não autenticado')
        return
      }

      setUserId(user.id)
    }

    carregarUsuario()
  }, [])

  async function salvarDados() {
    if (!userId) {
      setMensagem('Usuário não encontrado')
      return
    }

    const dados = {
      id: userId,
      tipo_conta: tipoConta,
      nome_1: nome1,
      nome_2: tipoConta === 'casal' ? nome2 : null,
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(dados)

    if (error) {
      console.error(error)
      setMensagem('Erro ao salvar os dados')
      return
    }

    setMensagem('Dados salvos com sucesso')
    router.push('/dashboard')
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Bem-vindo ao Mordomo</h1>

      {!tipoConta && (
        <>
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
        </>
      )}

      {tipoConta === 'individual' && (
        <>
          <p>Seu nome</p>
          <input
            value={nome1}
            onChange={e => setNome1(e.target.value)}
          />

          <button onClick={salvarDados} style={{ marginTop: 10 }}>
            Salvar
          </button>
        </>
      )}

      {tipoConta === 'casal' && (
        <>
          <p>Nome da primeira pessoa</p>
          <input
            value={nome1}
            onChange={e => setNome1(e.target.value)}
          />

          <p>Nome da segunda pessoa</p>
          <input
            value={nome2}
            onChange={e => setNome2(e.target.value)}
          />

          <button onClick={salvarDados} style={{ marginTop: 10 }}>
            Salvar
          </button>
        </>
      )}

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

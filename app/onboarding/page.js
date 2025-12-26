'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [tipoConta, setTipoConta] = useState('')
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    async function carregarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMensagem('Usuário não autenticado')
        return
      }

      setUser(user)
    }

    carregarUsuario()
  }, [])

  async function escolherTipo(tipo) {
    setTipoConta(tipo)
  }

  async function salvarDados() {
    if (!user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const dados = {
      id: user.id,
      tipo_conta: tipoConta,
      nome_1: nome1,
      nome_2: tipoConta === 'casal' ? nome2 : null,
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(dados, { onConflict: 'id' })

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

      {!tipoConta && (
        <>
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

      {tipoConta && (
        <>
          <p>Preencha os dados</p>

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
            Salvar
          </button>
        </>
      )}

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

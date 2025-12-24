'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const [tipo, setTipo] = useState(null)
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function carregarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    carregarUsuario()
  }, [])

  async function escolherTipo(tipoEscolhido) {
    setTipo(tipoEscolhido)
  }

  async function salvarNomes() {
    if (!user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      tipo_conta: tipo,
      nome_1: nome1,
      nome_2: tipo === 'casal' ? nome2 : null,
    })

    if (error) {
      setMensagem('Erro ao salvar dados')
    } else {
      setMensagem('Dados salvos com sucesso')
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Bem-vindo ao Mordomo</h1>

      {!tipo && (
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

      {tipo && (
        <>
          <p>
            {tipo === 'individual'
              ? 'Qual é o seu nome?'
              : 'Quais são os nomes do casal?'}
          </p>

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

          <button onClick={salvarNomes}>
            Salvar
          </button>
        </>
      )}

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

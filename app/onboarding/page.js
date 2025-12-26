'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const [tipo, setTipo] = useState('')
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function salvarDados() {
    setMensagem('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const dados = {
      id: user.id,
      tipo_conta: tipo,
      nome_1: nome1,
      nome_2: tipo === 'casal' ? nome2 : null,
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(dados)

    if (error) {
      console.error(error)
      setMensagem('Erro ao salvar os dados')
    } else {
      setMensagem('DADOS SALVOS COM SUCESSO')
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Bem-vindo ao Mordomo</h1>

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
            placeholder="Digite seu nome"
          />
          <br /><br />
          <button onClick={salvarDados}>
            Salvar
          </button>
        </>
      )}

      {tipo === 'casal' && (
        <>
          <p>Nome do primeiro</p>
          <input
            value={nome1}
            onChange={e => setNome1(e.target.value)}
            placeholder="Nome 1"
          />

          <p>Nome do segundo</p>
          <input
            value={nome2}
            onChange={e => setNome2(e.target.value)}
            placeholder="Nome 2"
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

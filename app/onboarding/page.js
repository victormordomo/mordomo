'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Onboarding() {
  const [mensagem, setMensagem] = useState('')

  async function escolherTipo(tipo) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMensagem('Usuário não autenticado. Faça login novamente.')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        tipo_conta: tipo,
      })

    if (error) {
      setMensagem('Erro ao salvar. Tente novamente.')
    } else {
      setMensagem('Escolha salva com sucesso!')
    }
  }

  return (
    <div style={{ padding: 40 }}>
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

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

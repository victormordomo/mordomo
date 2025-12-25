'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Transacoes() {
  const [tipo, setTipo] = useState('saida')
  const [categoria, setCategoria] = useState('alimentacao')
  const [valor, setValor] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function salvarTransacao() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const { error } = await supabase.from('transacoes').insert({
      user_id: user.id,
      tipo,
      categoria,
      valor,
      data: new Date(),
    })

    if (error) {
      setMensagem('Erro ao salvar transação')
    } else {
      setMensagem('Transação salva com sucesso')
      setValor('')
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Transações</h1>

      <label>Tipo</label>
      <select
        value={tipo}
        onChange={e => setTipo(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <label>Categoria</label>
      <select
        value={categoria}
        onChange={e => setCategoria(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      >
        <option value="alimentacao">Alimentação</option>
        <option value="habitacao">Habitação</option>
        <option value="lazer">Lazer</option>
        <option value="oferta">Oferta</option>
        <option value="investimento">Investimento</option>
        <option value="outros">Outros</option>
      </select>

      <label>Valor</label>
      <input
        type="number"
        value={valor}
        onChange={e => setValor(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <button onClick={salvarTransacao}>
        Salvar Transação
      </button>

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

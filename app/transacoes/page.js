'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Transacoes() {
  const [type, setType] = useState('saida')
  const [category, setCategory] = useState('alimentacao')
  const [amount, setAmount] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function salvarTransacao() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMensagem('Usuário não autenticado')
      return
    }

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: type,
        category: category,
        amount: Number(amount),
      })

    if (error) {
      console.error(error)
      setMensagem('Erro ao salvar transação')
    } else {
      setMensagem('Transação salva com sucesso')
      setAmount('')
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Transações</h1>

      <label>Tipo</label>
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <label>Categoria</label>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
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
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <button onClick={salvarTransacao}>
        Salvar Transação
      </button>

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

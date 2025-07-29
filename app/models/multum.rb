class Multum < ApplicationRecord
	
  def slim_obj
    {
      id: self.id,
      titulo:self.titulo,
      data:self.data,
      horario:self.horario,
      tipo:self.tipo,
      nome:self.nome,
      unidade:self.unidade,
      valor_multa:self.valor_multa,
      detalhes:self.detalhes
    }
  end

  def to_frontend_obj
    attrs = self.slim_obj
  end
end

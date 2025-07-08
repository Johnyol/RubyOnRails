class Comentario < ApplicationRecord
  belongs_to :tarefa

  validates :conteudo, presence: true, length: { minimum: 3 }

  def to_frontend_obj
  {
    id: self.id,
    conteudo: self.conteudo,
  }
  end

end

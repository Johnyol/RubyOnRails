class Tarefa < ApplicationRecord
  has_many :comentarios, dependent: :destroy

  validates :nome, presence: true, length: { minimum: 3 }
  validates :date_inicio, :data_fim, presence: true
  validate :data_fim_deve_ser_maior_ou_igual_a_data_inicio

  def slim_obj
    {
      id: self.id,
      nome: self.nome,
      date_inicio: self.date_inicio.strftime,
      data_fim: self.data_fim.strftime,
      custo: self.custo,
      status: self.status
    }
  end

  def to_frontend_obj
    attrs = self.slim_obj
    attrs[:comentarios] = self.comentarios.map(&:to_frontend_obj)
    attrs
  end

  def data_fim_deve_ser_maior_ou_igual_a_data_inicio
    return if data_fim.blank? || date_inicio.blank?

    if data_fim < date_inicio
      errors.add(:data_fim, "deve ser maior ou igual à data de início")
    end
  end
end
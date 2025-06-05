class Tarefa < ApplicationRecord
  has_many :comentarios, dependent: :destroy
end

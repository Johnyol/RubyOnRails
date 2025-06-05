class CreateTarefas < ActiveRecord::Migration[8.0]
  def change
    create_table :tarefas do |t|
      t.string :nome
      t.date :date_inicio
      t.date :data_fim
      t.decimal :custo
      t.string :status

      t.timestamps
    end
  end
end

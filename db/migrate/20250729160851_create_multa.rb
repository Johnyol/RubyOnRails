class CreateMulta < ActiveRecord::Migration[8.0]
  def change
    create_table :multa do |t|
      t.string :titulo
      t.date :data
      t.time :horario
      t.string :tipo
      t.string :nome
      t.string :unidade
      t.decimal :valor_multa
      t.string :detalhes

      t.timestamps
    end
  end
end

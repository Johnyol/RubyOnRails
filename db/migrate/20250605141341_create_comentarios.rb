class CreateComentarios < ActiveRecord::Migration[8.0]
  def change
    create_table :comentarios do |t|
      t.text :conteudo
      t.references :tarefa, null: false, foreign_key: true

      t.timestamps
    end
  end
end

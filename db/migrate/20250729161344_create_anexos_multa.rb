class CreateAnexosMulta < ActiveRecord::Migration[8.0]
  def change
    create_table :anexos_multa do |t|
      t.string :nome_arquivo
      t.string :tipo_arquivo
      t.string :caminho_arquivo
      t.references :multa, null: false, foreign_key: true

      t.timestamps
    end
  end
end

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_29_161344) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "anexos_multa", force: :cascade do |t|
    t.string "nome_arquivo"
    t.string "tipo_arquivo"
    t.string "caminho_arquivo"
    t.bigint "multa_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["multa_id"], name: "index_anexos_multa_on_multa_id"
  end

  create_table "comentarios", force: :cascade do |t|
    t.text "conteudo"
    t.bigint "tarefa_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tarefa_id"], name: "index_comentarios_on_tarefa_id"
  end

  create_table "multa", force: :cascade do |t|
    t.string "titulo"
    t.date "data"
    t.time "horario"
    t.string "tipo"
    t.string "nome"
    t.string "unidade"
    t.decimal "valor_multa"
    t.string "detalhes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tarefas", force: :cascade do |t|
    t.string "nome"
    t.date "date_inicio"
    t.date "data_fim"
    t.decimal "custo"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "anexos_multa", "multa", column: "multa_id"
  add_foreign_key "comentarios", "tarefas"
end

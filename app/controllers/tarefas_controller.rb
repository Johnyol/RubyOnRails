class TarefasController < ApplicationController
  before_action :set_tarefas, only: [ :index, :create, :update ]

def index
    render json: @tarefas, include: :comentarios 
end

def create
  @tarefa = Tarefa.new(tarefa_params)

  if @tarefa.save
    render json: @tarefa, status: :created
  else
    render json: { errors: @tarefa.errors.full_messages }, status: :unprocessable_entity
  end
  
end

def update
  if @tarefa.update(tarefa_params)
    render json: @tarefa, status: :ok
  else
    render json: @tarefa.errors, status: :unprocessable_entity
  end
end

def destroy
  @tarefa.destroy
end

private

def tarefa_params
  params.require(:tarefa).permit(:nome, :date_inicio, :data_fim, :custo, :status)
end

def set_tarefas
  @tarefas = Tarefa.includes(:comentarios).order(created_at: :desc)
end

end
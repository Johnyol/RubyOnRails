class TarefasController < ApplicationController
def tarefa_params
  params.require(:tarefa).permit(:nome, :date_inicio, :data_fim, :custo, :status)
end

def index
  @tarefa = Tarefa.new
  @tarefas = Tarefa.includes(:comentarios).order(created_at: :desc)
end

def create
  @tarefa = Tarefa.new(tarefa_params)
  if @tarefa.save
    redirect_to tarefas_path, notice: "Tarefa criada com sucesso."
  else
    @tarefas = Tarefa.includes(:comentarios).order(created_at: :desc)
    render :index
  end
end

private
end

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
    redirect_to root_path, notice: "Tarefa criada com sucesso."
  else
    @tarefas = Tarefa.includes(:comentarios).order(created_at: :desc)
    render :index
  end
end

def edit
  @tarefas = Tarefa.all
  @tarefa = Tarefa.find(params[:id])
  render :"pages/home"
end

def update
  @tarefa = Tarefa.find(params[:id])
  if @tarefa.update(tarefa_params)
    redirect_to root_path, notice: "Tarefa atualizada com sucesso."
  else
    @tarefas = Tarefa.includes(:comentarios).order(created_at: :desc)
    render :index
  end
end

def destroy
  @tarefa = Tarefa.find(params[:id])
  @tarefa.destroy
  redirect_to root_path, notice: "Tarefa excluída com sucesso."
end
private
end

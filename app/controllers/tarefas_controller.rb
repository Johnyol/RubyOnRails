class TarefasController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    tarefas = Tarefa.includes(:comentarios).order(created_at: :desc)
    render json: tarefas, include: :comentarios 
  end

  def create
    tarefa = Tarefa.new(tarefa_params)

    if tarefa.save
      render json: tarefa, status: :created
    else
      render json: { errors: tarefa.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    tarefa = Tarefa.find(params[:id])

    if tarefa.update(tarefa_params)
      render json: tarefa, status: :ok
    else
      render json: tarefa.errors, status: :unprocessable_entity
    end
  end

  def destroy
    tarefa = Tarefa.find(params[:id])
    tarefa.destroy
  end

  private

  def tarefa_params
    params.require(:tarefa).permit(:nome, :date_inicio, :data_fim, :custo, :status)
  end

end
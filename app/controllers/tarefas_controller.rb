class TarefasController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    tarefas = Tarefa.includes(:comentarios).order(created_at: :desc)
    render json: tarefas, include: :comentarios 
  end

  def save
 
    tarefa = Tarefa.find_or_initialize_by(id: tarefa_params[:id])

    tarefa.assign_attributes(tarefa_params)

    if tarefa.save
      
      status = tarefa.previously_new_record? ? :created : :ok
      render json: tarefa, status: status
    else
      render json: { errors: tarefa.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    tarefa = Tarefa.find(params[:id])
    tarefa.destroy
  end

  private

  def tarefa_params
    params.require(:tarefa).permit(:id, :nome, :date_inicio, :data_fim, :custo, :status)
  end

end
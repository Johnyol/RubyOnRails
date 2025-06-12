class TarefasController < ApplicationController
  before_action :set_tarefas, only: [ :index, :create, :update ]

  def index
    @tarefa = Tarefa.new
  end

 def show
    @tarefa = Tarefa.find(params[:id])
 end

  def new
    @tarefa = Tarefa.new
    respond_to do |format|
      format.html do
        render layout: false if turbo_frame_request?
      end
    end
  end

def edit
    @tarefa = Tarefa.find(params[:id])
    respond_to do |format|
      format.html do
        render layout: false if turbo_frame_request?
      end
    end
end

  def create
    @tarefa = Tarefa.new(tarefa_params)
    if @tarefa.save
        redirect_to root_path, notice: "Tarefa criada com sucesso."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    @tarefa = Tarefa.find(params[:id])
    if @tarefa.update(tarefa_params)
     redirect_to root_path, notice: "Tarefa atualizada com sucesso."

    else
      render :edit, status: :unprocessable_entity
    end
  end


def destroy
  @tarefa = Tarefa.find(params[:id])
  @tarefa.destroy

  respond_to do |format|
    format.html { redirect_to root_path, notice: "Tarefa excluída com sucesso." }
    format.turbo_stream
  end
end

  private

  def tarefa_params
    params.require(:tarefa).permit(:nome, :date_inicio, :data_fim, :custo, :status)
  end

  def set_tarefas
    @tarefas = Tarefa.includes(:comentarios).order(created_at: :desc)
  end
end

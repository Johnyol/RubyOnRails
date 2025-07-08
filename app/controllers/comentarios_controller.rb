class ComentariosController < ApplicationController
  include ActionView::RecordIdentifier
  protect_from_forgery with: :null_session

  def create
    tarefa = Tarefa.find(params[:tarefa_id])
    comentario = tarefa.comentarios.build(comentario_params)

    if comentario.save
      render json: comentario, status: :created
    else
      render json: { errors: comentario.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    tarefa = Tarefa.find(params[:tarefa_id])
    comentario = tarefa.comentarios.find(params[:id])
    comentario.destroy

    head :no_content
  end
  
  private

  def comentario_params
    params.require(:comentario).permit(:conteudo)
  end
end

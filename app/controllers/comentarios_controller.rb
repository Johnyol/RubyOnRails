class ComentariosController < ApplicationController
  include ActionView::RecordIdentifier
  protect_from_forgery with: :null_session

  def create
    tarefa = Tarefa.find(params[:tarefa_id])
    comentario = tarefa.comentarios.build(comentario_params)

    if comentario.save
      render json: {comentario: comentario.to_frontend_obj}, status: :created
    else
      render json: { errors: comentario.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    tarefa = Tarefa.find(params[:tarefa_id])
    comentario = tarefa.comentarios.find(params[:id])
    comentario.destroy

    render json: {comentario_id: {id: comentario.id}}, status: :ok
  end
  
  private

  def comentario_params
    params.require(:comentario).permit(:conteudo)
  end
end

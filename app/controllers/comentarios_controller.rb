class ComentariosController < ApplicationController
def create
  @tarefa = Tarefa.find(params[:tarefa_id])
  @comentario = @tarefa.comentarios.build(comentario_params)

  if @comentario.save
    redirect_to root_path, notice: "Comentário salvo com sucesso."
  else
    redirect_to root_path, alert: "Erro ao salvar comentário."
  end
end

private

def comentario_params
  params.require(:comentario).permit(:conteudo)
end
end

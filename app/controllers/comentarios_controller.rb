class ComentariosController < ApplicationController
  include ActionView::RecordIdentifier

  def create
    @tarefa = Tarefa.find(params[:tarefa_id])
    @comentario = @tarefa.comentarios.build(comentario_params)

    respond_to do |format|
      if @comentario.save
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append("comentarios_tarefa_#{@tarefa.id}",
                                partial: "comentarios/comentario",
                                locals: { comentario: @comentario }),

            turbo_stream.replace(dom_id(@tarefa, "new_comment_form"),
                                  partial: "comentarios/form",
                                  locals: { tarefa: @tarefa })
          ]
        end
        format.html { redirect_to root_path, notice: "Comentário salvo com sucesso." }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            dom_id(@tarefa, "new_comment_form"),
            partial: "comentarios/form",
            locals: { tarefa: @tarefa, comentario: @comentario }
          ), status: :unprocessable_entity
        end
        format.html { redirect_to root_path, alert: "Erro ao salvar comentário." }
      end
    end
  end

  def destroy
    @tarefa = Tarefa.find(params[:tarefa_id])
    @comentario = @tarefa.comentarios.find(params[:id])
    @comentario.destroy

    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.remove(@comentario) }

      format.html { redirect_to @tarefa.projeto, notice: "Comentário excluído com sucesso." }
    end
  end

  private

  def comentario_params
    params.require(:comentario).permit(:conteudo)
  end
end

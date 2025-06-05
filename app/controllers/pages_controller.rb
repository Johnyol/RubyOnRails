class PagesController < ApplicationController
  def home
      @tarefas = Tarefa.all
  end
end

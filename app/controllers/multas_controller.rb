class MultasController < ApplicationController
  def index
   
    multas = Multum.all.map { |multa| multa.to_frontend_obj }

    render json: { lista: multas }
  end

end

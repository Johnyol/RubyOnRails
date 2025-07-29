class PagesController < ApplicationController
  def home
      @multas = Multum.all
  end
end

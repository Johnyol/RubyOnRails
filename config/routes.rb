Rails.application.routes.draw do
  root "pages#home"
  get "/pages", to: "pages#home"

  get "carregar_form_tarefa", to: "tarefas#carregar_form", as: :carregar_tarefa_form

  resources :tarefas do
    resources :comentarios, only: [ :create, :destroy ]

    member do
      delete :delete_comments
    end
  end

  # Rota para o health check do Rails
  get "up" => "rails/health#show", as: :rails_health_check
end

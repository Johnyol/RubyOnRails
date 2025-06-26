Rails.application.routes.draw do
  root "pages#home"
  get "/pages", to: "pages#home"

  resources :tarefas, only: [:index, :destroy] do
    resources :comentarios, only: [ :create, :destroy ]
    member do
      delete :delete_comments
    end
  end

  post 'tarefas/save', to: 'tarefas#save'

  get "up" => "rails/health#show", as: :rails_health_check
end
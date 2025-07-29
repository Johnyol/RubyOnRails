Rails.application.routes.draw do
  root "pages#home"
  get "/pages", to: "pages#home"

  resources :multas, only: [:index, :destroy]

  post 'multas/save', to: 'multas#save'

  get "up" => "rails/health#show", as: :rails_health_check
end
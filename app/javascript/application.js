import jquery from 'jquery'
window.$ = jquery
window.jquery = jquery
import "@hotwired/turbo-rails"
import "controllers"

angular.module('meuApp', []).controller('TarefaController', function($scope, $http) {
  function init(){
    $scope.listCtrl.buscar();
  };

  $scope.listCtrl = {

  tarefas: [],

  buscar: () => {
   $http.get("http://localhost:3000/tarefas.json")
    .then(
      (response) => {
        var tarefasBanco = response.data;

        tarefasBanco.forEach((tarefa) => {
          tarefa.aberta = false; 
        });

        $scope.listCtrl.tarefas = tarefasBanco;

      },
      (error) => {
        console.error("Ocorreu um erro ao buscar as tarefas:", error);
      }
    );
  },
  }

  $scope.itemCtrl = {
    abrirTarefaItem: (tarefa)=> {
      tarefa.aberta = !tarefa.aberta;
    }
  }

  $scope.formCtrl = {
    ativo: false,
    novaTarefa: [], 

    open: ()=>{
      if($scope.formCtrl.ativo) {return};
      $scope.formCtrl.ativo = true
    },

    close: ()=>{
      if(!$scope.formCtrl.ativo) {return};
      $scope.formCtrl.ativo = false
    },

    criarTarefa: ()=> {      
      console.log($scope.formCtrl.novaTarefa);

      $http.post("http://localhost:3000/tarefas.json", $scope.formCtrl.novaTarefa)
        .then((response) => {
          console.log("Tarefa criada com sucesso:", response.data);
        },
        (error) => {
          console.error("Ocorreu um erro ao criar a tarefa:", error);
        });
    }

    
  }

  init();
  
});
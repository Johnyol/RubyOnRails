import jquery from 'jquery'
window.$ = jquery
window.jquery = jquery
import "@hotwired/turbo-rails"
import "controllers"

angular.module('meuApp', []).controller('TarefaController', function($scope, $http) {
  function init(){
    carregarTarefas();
  };

  var carregarTarefas = function() {
    $http.get("http://localhost:3000/tarefas.json")
      .then(
        function(response) {
          var tarefasBanco = response.data;

          tarefasBanco.forEach(function(tarefa) {
            tarefa.Aberta = false; // Todas começam fechadas
          });

          $scope.tarefas = tarefasBanco;

          console.log($scope.tarefas);
        },
        function(error) {
          console.error("Ocorreu um erro ao buscar as tarefas:", error);
        }
      );
  };

  $scope.abrirTarefaItem = function(tarefa) {
    tarefa.Aberta = !tarefa.Aberta;
  };

  $scope.formCtrl = {
    ativo: false,

    open: ()=>{
      if($scope.formCtrl.ativo) {return};
      $scope.formCtrl.ativo = true
    },

    close: ()=>{
      if(!$scope.formCtrl.ativo) {return};
      $scope.formCtrl.ativo = false
    }
  }

  init();
  
});
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
    novaTarefa: {}, 

    open: ()=>{
      if($scope.formCtrl.ativo) {return};
      $scope.formCtrl.ativo = true
    },

    close: ()=>{
      if(!$scope.formCtrl.ativo) {return};
      $scope.formCtrl.ativo = false
      $scope.formCtrl.novaTarefa = {};
    },

    editarTarefa: (tarefa)=>{
      $scope.formCtrl.novaTarefa = angular.copy(tarefa);
      $scope.formCtrl.open();
      console.log($scope.formCtrl.novaTarefa);
    },

    salvarTarefa: ()=> { 
      var tarefaParaSalvar = $scope.formCtrl.novaTarefa;

      if(tarefaParaSalvar.id){
        $http.put("http://localhost:3000/tarefas/" + tarefaParaSalvar.id + ".json", { tarefa: tarefaParaSalvar })
        .then((response) => {
          console.log("Tarefa atualizada com sucesso:", response.data);
          $scope.listCtrl.buscar();
          $scope.formCtrl.close();
        },
        (error) => {
          console.error("Ocorreu um erro ao criar a tarefa:", error);
        });

        }
      else{
        $http.post("http://localhost:3000/tarefas.json", $scope.formCtrl.novaTarefa)
        .then((response) => {
          console.log("Tarefa criada com sucesso:", response.data);
          $scope.listCtrl.buscar();
          $scope.formCtrl.close();
        },
        (error) => {
          console.error("Ocorreu um erro ao criar a tarefa:", error);
        });
      }
    },

    excluirTarefa: ()=>{
      var idTarefa = $scope.formCtrl.novaTarefa.id;
      $http.delete("http://localhost:3000/tarefas/" + idTarefa + ".json")
      .then(
        (response) => {
          console.log("Tarefa excluída com sucesso");
          $scope.listCtrl.buscar(); 
          $scope.formCtrl.close();   
        },
        (error) => {
          console.error("Ocorreu um erro ao excluir a tarefa:", error);
          alert("Não foi possível excluir a tarefa. Tente novamente.");
        }
      );
    }

  }

  init();
  
});
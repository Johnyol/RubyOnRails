import jquery from 'jquery'
window.$ = jquery
window.jquery = jquery
import "@hotwired/turbo-rails"
import "controllers"

angular.module('meuApp', []).controller('TarefaController', function($scope, $http) {
  function init(){
    $scope.listCtrl.buscar();
  };

  function converterStringParaDataLocal(stringData) {
    if (!stringData || typeof stringData !== 'string') return null;
    const partes = stringData.split('-').map(Number);
    if (partes.length !== 3 || isNaN(partes[0]) || isNaN(partes[1]) || isNaN(partes[2])) {
        return null;
    }
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }

  $scope.listCtrl = {

    tarefas: [],

    buscar: () => {
     $http.get("/tarefas.json")
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
      const tarefaParaEditar = angular.copy(tarefa);

      tarefaParaEditar.date_inicio = converterStringParaDataLocal(tarefaParaEditar.date_inicio);
      tarefaParaEditar.data_fim = converterStringParaDataLocal(tarefaParaEditar.data_fim);

      $scope.formCtrl.novaTarefa = tarefaParaEditar;

      $scope.formCtrl.open();
      console.log($scope.formCtrl.novaTarefa);
    },

    salvarTarefa: ()=> { 
      var tarefaParaSalvar = $scope.formCtrl.novaTarefa;
    
      $http.post("/tarefas/save.json", { tarefa: tarefaParaSalvar })
      .then((response) => {
        console.log("Tarefa atualizada com sucesso:", response.data);
        $scope.listCtrl.buscar();
        $scope.formCtrl.close();
      },
      (error) => {
        console.error("Ocorreu um erro ao criar a tarefa:", error);
      });
    },

    excluirTarefa: ()=>{
      var idTarefa = $scope.formCtrl.novaTarefa.id;
      $http.delete("/tarefas/" + idTarefa + ".json")
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

  $scope.formComentCtrl ={
    comentarioTarefa: {},

    criarComentario: (tarefa) => {
      const comentario = tarefa.novoComentario.conteudo;

      $scope.formComentCtrl.comentarioTarefa = {
        comentario: {
          conteudo: comentario
        }
      };

      $http.post(`/tarefas/${tarefa.id}/comentarios.json`, $scope.formComentCtrl.comentarioTarefa)
        .then((response) => {
          console.log("Comentário criado com sucesso:", response.data);
          
          tarefa.comentarios.push(response.data);
          
          tarefa.novoComentario = {};

          $scope.formComentCtrl.comentarioTarefa = {};

        }, (error) => {
          console.error("Erro ao criar comentário:", error);
        });
    },

    excluirComentario: (tarefa, comentario) =>{

      $http.delete(`/tarefas/${tarefa.id}/comentarios/${comentario.id}.json`)
      .then((response) => {
        console.log("Comentário excluído com sucesso");

        const index = tarefa.comentarios.indexOf(comentario);
        if (index > -1) {
          tarefa.comentarios.splice(index, 1);
        }
      }, (error) => {
        console.error("Erro ao excluir o comentário:", error);
      });
    }

  }

  init();

  
});
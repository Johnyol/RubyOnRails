import jquery from 'jquery'
window.$ = jquery
window.jquery = jquery
import "controllers"

angular.module('meuApp', []).controller('TarefaController', function($scope, $http) {
  function init(){
    $scope.listCtrl.buscar();
  };

  function converterStringParaDataLocal(stringData) {
    if (!stringData || typeof stringData !== 'string') return null;
    if (stringData instanceof Date) return stringData;
    const partes = stringData.split('-').map(Number);
    if (partes.length !== 3 || isNaN(partes[0]) || isNaN(partes[1]) || isNaN(partes[2])) {
        return null;
    }
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }

  $scope.opcoesDeStatus = [
    { valor: 'Pendente', nome: 'Pendente' },
    { valor: 'Em Andamento', nome: 'Em Andamento' },
    { valor: 'Concluído', nome: 'Concluído' }
  ];

  $scope.listCtrl = {
    tarefas:[],

    buscar: (termoBusca) => {
      const config = {
        params: {
          q: termoBusca
        }
      };

      $scope.listCtrl.tarefas = [];

      $http.get("/tarefas.json", config)
        .then(
          (response) => {
            $scope.listCtrl.handle(response.data.lista);
          },
          (error) => {
            console.error("Ocorreu um erro ao buscar as tarefas:", error);
          }
        );
    },

    handle: (lista) => { 
      lista = [lista].flat();

      lista.forEach((tarefa) => { 
        tarefa.date_inicio = converterStringParaDataLocal(tarefa.date_inicio);
        tarefa.data_fim = converterStringParaDataLocal(tarefa.data_fim);
        tarefa.custo = parseFloat(tarefa.custo);

        const tarefaEncontrada = $scope.listCtrl.tarefas.find(item => item.id === tarefa.id);

        if (tarefaEncontrada) {
          angular.extend(tarefaEncontrada, tarefa);
        } else {
          $scope.listCtrl.tarefas.push(tarefa);
        }

      });
    }
  };

  $scope.itemCtrl = {
    abrirTarefaItem: (tarefa)=> {

      if($scope.formCtrl.ativo && tarefa.editando){
        return;
      }else if(!tarefa.editando){
        tarefa.aberta = !tarefa.aberta;
      }
      
    },
  }

  $scope.formCtrl = {
    ativo: false,
    errosDoServidor : [],

    open: (tarefa)=>{
      if ($scope.formCtrl.ativo) return;

      $scope.formCtrl.ativo = true;

      tarefa = tarefa || {};
      tarefa.aberta   = true
      tarefa.editando = true

      $scope.formCtrl.params = angular.copy(tarefa);

      $scope.formCtrl.newRecord = !$scope.formCtrl.params.id;

      if ($scope.formCtrl.newRecord){
        $scope.formCtrl.params.date_inicio = new Date(),
        $scope.formCtrl.params.status = 'Pendente'

        $scope.listCtrl.tarefas.unshift($scope.formCtrl.params);
      }
    },

    close: (tarefa)=>{
      tarefa = tarefa || {};
      
      if($scope.formCtrl.newRecord){
        const tarefa = $scope.listCtrl.tarefas.find(item => !item.id)
        const index = $scope.listCtrl.tarefas.indexOf(tarefa);
        if (index > -1) {
          $scope.listCtrl.tarefas.splice(index, 1);
        }
      }else{
        const tarefa = $scope.listCtrl.tarefas.find(item => item.id === $scope.formCtrl.params.id)
        tarefa.editando = false;
      }
      $scope.formCtrl.ativo = false;
      $scope.formCtrl.newRecord = false;
      $scope.formCtrl.params = {};
      $scope.formCtrl.errosDoServidor = [];
      tarefa.errosDoServidor = [];
    },

    salvarTarefa: (tarefa)=> { 

      const dadosParaSalvar = angular.copy($scope.formCtrl.params);

      if(tarefa.id){
        dadosParaSalvar.id = tarefa.id;
      }

      $http.post("/tarefas/save.json", { tarefa: dadosParaSalvar })
      .then((response) => {
        console.log("Tarefa sendo processada");
        const tarefaSalva = response.data.tarefa

        if($scope.formCtrl.newRecord){
          const nova_tarefa = $scope.listCtrl.tarefas.find(item => !item.id);
          angular.extend(nova_tarefa, tarefaSalva);
          $scope.listCtrl.buscar();
        }else{
          $scope.listCtrl.handle(tarefaSalva);
        }
        
        $scope.formCtrl.close();

      },
      (error) => {
        console.error("Ocorreu um erro ao salvar a tarefa:", error);
        console.log(tarefa);
        tarefa.errosDoServidor = error.data.errors;
      });
    },

    excluirTarefa: (tarefa)=>{
      $http.delete("/tarefas/" + tarefa.id + ".json")
      .then(
        (response) => {
          console.log("Tarefa excluída com sucesso");
          const index = $scope.listCtrl.tarefas.indexOf(tarefa);
          if (index > -1) {
            $scope.listCtrl.tarefas.splice(index, 1);
          }
          
          tarefa.editando = false
          $scope.formCtrl.ativo = false
        },
        (error) => {
          console.error("Ocorreu um erro ao excluir a tarefa:", error);
          alert("Não foi possível excluir a tarefa. Tente novamente.");
        }
      );
    }
  }

  $scope.formComentCtrl = {

    errosComentario: {},

    criarComentario: (tarefa) => {
      if (!tarefa.novoComentario) {
        tarefa.novoComentario = { conteudo: '' };
      }
      tarefa.errosComentario = {};
   
      const comentarioTarefa = {
        tarefa:{
          id: tarefa.id,
          comentarios_attributes: [{ conteudo: tarefa.novoComentario.conteudo}]
        }
      };
      $http.post(`/tarefas/save.json`, comentarioTarefa)
        .then((response) => {
          console.log("Comentário criado com sucesso");
          tarefa.comentarios = response.data.tarefa.comentarios;
          tarefa.novoComentario.conteudo = '';
        }, (error) => {
          console.error("Erro ao criar comentário:", error);
          tarefa.errosComentario = error.data.errors;
        });
    },

    excluirComentario: (tarefa, comentario) =>{

      const comentarioTarefa = {
        tarefa:{ 
          id: tarefa.id, 
          comentarios_attributes: [{id: comentario.id, _destroy: true}]
        }
      };

      $http.post(`/tarefas/save.json`, comentarioTarefa)
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
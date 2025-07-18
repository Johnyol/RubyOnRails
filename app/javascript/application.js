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

  $scope.opcoesDeStatus = [
    { valor: 'Pendente', nome: 'Pendente' },
    { valor: 'Em Andamento', nome: 'Em Andamento' },
    { valor: 'Concluído', nome: 'Concluído' }
  ];

  $scope.listCtrl = {
    tarefas: [],

    buscar: (termoBusca) => {
      const config = {
        params: {
          q: termoBusca
        }
      };

      $http.get("/tarefas.json", config)
        .then(
          (response) => {
            var tarefasBanco = response.data.lista;

            tarefasBanco.forEach((tarefa) => {
              tarefa.aberta = false;
              tarefa.editando = false;
              tarefa.date_inicio = converterStringParaDataLocal(tarefa.date_inicio);
              tarefa.data_fim = converterStringParaDataLocal(tarefa.data_fim);
              tarefa.custo = parseFloat(tarefa.custo);
            });

            $scope.listCtrl.tarefas = tarefasBanco;
          },
          (error) => {
            console.error("Ocorreu um erro ao buscar as tarefas:", error);
          }
        );
    },
  };

  $scope.itemCtrl = {
    abrirTarefaItem: (tarefa)=> {

      if (tarefa.editando) {
        return;
      }

      const algumaTarefaEditando = $scope.listCtrl.tarefas.some(t => t.editando);
      if (algumaTarefaEditando) {
        if (!tarefa.editando) {
          return; 
        }
      }
     
      tarefa.aberta = !tarefa.aberta;
    },

    cancelarTarefaEdicao: (tarefa) => {
      angular.extend(tarefa, $scope.formCtrl.tarefaOriginal);

      tarefa.editando = false;
      $scope.formCtrl.emModoEdicao = false;
      $scope.formCtrl.tarefaOriginal = {};
      $scope.formCtrl.errosDoServidor = [];
    }
  }

  $scope.formCtrl = {
    ativo: false,
    emModoEdicao: false,
    errosDoServidor: {},
    novaTarefa: {}, 
    tarefaOriginal: {},

    open: ()=>{
      if($scope.formCtrl.ativo) {return};
      $scope.formCtrl.ativo = true
    },

    close: ()=>{
      if(!$scope.formCtrl.ativo) {return};
      $scope.formCtrl.ativo = false
      $scope.formCtrl.novaTarefa = {};
      $scope.formCtrl.errosDoServidor = [];
    },

    editarTarefa: (tarefa)=>{
      
      $scope.formCtrl.tarefaOriginal = angular.copy(tarefa);
      $scope.formCtrl.errosDoServidor = [];
      $scope.formCtrl.close();
      $scope.formCtrl.emModoEdicao = true;
      
      $scope.listCtrl.tarefas.forEach(t => {
        if (t.id !== tarefa.id) {
          t.aberta = false;
          t.editando = false;
        }
      });
      tarefa.aberta = true;
      tarefa.editando = true;
      
    },

    salvarTarefa: (tarefa)=> { 

      let tarefaParaSalvar;

      if (tarefa) {
        tarefaParaSalvar = tarefa;
      } else {
        tarefaParaSalvar = $scope.formCtrl.novaTarefa;
      }
        
      $http.post("/tarefas/save.json", { tarefa: tarefaParaSalvar })
      .then((response) => {
        console.log("Tarefa atualizada com sucesso");
        $scope.listCtrl.buscar();
        $scope.formCtrl.close();
        $scope.formCtrl.errosDoServidor = [];
        $scope.formCtrl.emModoEdicao = false; 
      },
      (error) => {
        console.error("Ocorreu um erro ao criar a tarefa:", error);
        $scope.formCtrl.errosDoServidor = error.data.errors;
      });
    },

    excluirTarefa: (tarefa)=>{
      $http.delete("/tarefas/" + tarefa.id + ".json")
      .then(
        (response) => {
          console.log("Tarefa excluída com sucesso");
          $scope.listCtrl.buscar(); 
          $scope.formCtrl.emModoEdicao = false; 
          $scope.formCtrl.tarefaOriginal = {};  
        },
        (error) => {
          console.error("Ocorreu um erro ao excluir a tarefa:", error);
          alert("Não foi possível excluir a tarefa. Tente novamente.");
        }
      );
    }

  }

  $scope.formComentCtrl ={
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
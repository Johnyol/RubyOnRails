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
        return; 
      }
      
      tarefa.aberta = !tarefa.aberta;
    },

    cancelarTarefaEdicao: (tarefa) => {
      
      if (!tarefa.id) {
        const index = $scope.listCtrl.tarefas.indexOf(tarefa);
        if (index > -1) {
          $scope.listCtrl.tarefas.splice(index, 1);
        }
      } else {
        angular.extend(tarefa, $scope.formCtrl.tarefaOriginal);
        tarefa.editando = false;
      }

      $scope.formCtrl.emModoEdicao = false;
      $scope.formCtrl.tarefaOriginal = {};
    }
  }

  $scope.formCtrl = {
    
    emModoEdicao: false,
    tarefaOriginal: {},
    
    iniciarNovaTarefa: () => {
      if ($scope.formCtrl.emModoEdicao) return;

      const novaTarefa = {
        id: null,
        nome: '',
        date_inicio: new Date(),
        data_fim: null,
        custo: 0,
        status: 'Pendente',
        editando: true,
        aberta: false,
        errosDoServidor: {}
      };
      
      $scope.listCtrl.tarefas.unshift(novaTarefa);

      $scope.formCtrl.emModoEdicao = true;
    },

    editarTarefa: (tarefa)=>{
      if ($scope.formCtrl.emModoEdicao) return;
   
      $scope.formCtrl.tarefaOriginal = angular.copy(tarefa);
      $scope.formCtrl.emModoEdicao = true;
   
      $scope.listCtrl.tarefas.forEach(t => {
        t.aberta = (t === tarefa);
        t.editando = (t === tarefa);
      });
    },

    salvarTarefa: (tarefa)=> { 

      $http.post("/tarefas/save.json", { tarefa: tarefa })
      .then((response) => {
        console.log("Tarefa salva com sucesso");

       
        const tarefaSalva = response.data.tarefa;
        
        tarefaSalva.date_inicio = converterStringParaDataLocal(tarefaSalva.date_inicio);
        tarefaSalva.data_fim = converterStringParaDataLocal(tarefaSalva.data_fim);
        tarefaSalva.custo = parseFloat(tarefaSalva.custo);

        angular.extend(tarefa, tarefaSalva); 

        tarefa.editando = false; 
        tarefa.aberta = false;
        tarefa.errosDoServidor = {}; 
        $scope.formCtrl.emModoEdicao = false; 
      },
      (error) => {
        console.error("Ocorreu um erro ao salvar a tarefa:", error);
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
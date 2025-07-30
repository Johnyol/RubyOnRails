import "controllers"

angular.module('meuApp', []).controller('MultaController', function($scope, $http) {
  function init(){
    $scope.listCtrl.buscar();
  };

  $scope.listCtrl = {
    multas:[],

    buscar: () => {
     
      $scope.listCtrl.multas = [];

      $http.get("/multas.json")
        .then(
          (response) => {
           $scope.listCtrl.multas = response.data.lista;
           console.log($scope.listCtrl.multas)

          $scope.listCtrl.multas.forEach((multa) => { 
            multa.aberta = false;

          });

          },
          (error) => {
            console.error("Ocorreu um erro ao buscar as multas:", error);
          }
        );
    },

    // handle: (lista) => { 
    //   lista = [lista].flat();

    //   lista.forEach((tarefa) => { 
    //     tarefa.date_inicio = converterStringParaDataLocal(tarefa.date_inicio);
    //     tarefa.data_fim = converterStringParaDataLocal(tarefa.data_fim);
    //     tarefa.custo = parseFloat(tarefa.custo);

    //     const tarefaEncontrada = $scope.listCtrl.tarefas.find(item => item.id === tarefa.id);

    //     if (tarefaEncontrada) {
    //       angular.extend(tarefaEncontrada, tarefa);
    //     } else {
    //       $scope.listCtrl.tarefas.push(tarefa);
    //     }

    //   });
    // }
  };

  $scope.itemCtrl = {
    abriMultaItem: (multa)=> {
      console.log(multa.aberta, "Clicado")
      multa.aberta = !multa.aberta;
      console.log(multa.aberta, "Clicado")
    },
  }

  $scope.formCtrl = {
    ativo: false,
    errosDoServidor : [],

    open: (multa)=>{
      if ($scope.formCtrl.ativo) return;

      $scope.formCtrl.ativo = true;

      multa = multa || {};
      multa.aberta   = true
      multa.editando = true

      $scope.formCtrl.params = angular.copy(multa);

      $scope.formCtrl.newRecord = !$scope.formCtrl.params.id;

      if ($scope.formCtrl.newRecord){
        $scope.formCtrl.params.data = new Date(),
        $scope.listCtrl.multas.unshift($scope.formCtrl.params);
      }
    },

    close: (multa)=>{
      multa = multa || {};
      
      if($scope.formCtrl.newRecord){
        const multa = $scope.listCtrl.multas.find(item => !item.id)
        const index = $scope.listCtrl.multas.indexOf(multa);
        if (index > -1) {
          $scope.listCtrl.multas.splice(index, 1);
        }
      }else{
        const multa = $scope.listCtrl.multas.find(item => item.id === $scope.formCtrl.params.id)
        multa.editando = false;
      }
      $scope.formCtrl.ativo = false;
      $scope.formCtrl.newRecord = false;
      $scope.formCtrl.params = {};
      $scope.formCtrl.errosDoServidor = [];
      multa.errosDoServidor = [];
    },

    // salvarTarefa: (tarefa)=> { 

    //   const dadosParaSalvar = angular.copy($scope.formCtrl.params);

    //   if(tarefa.id){
    //     dadosParaSalvar.id = tarefa.id;
    //   }

    //   $http.post("/tarefas/save.json", { tarefa: dadosParaSalvar })
    //   .then((response) => {
    //     console.log("Tarefa sendo processada");
    //     const tarefaSalva = response.data.tarefa

    //     if($scope.formCtrl.newRecord){
    //       const nova_tarefa = $scope.listCtrl.tarefas.find(item => !item.id);
    //       angular.extend(nova_tarefa, tarefaSalva);
    //       $scope.listCtrl.buscar();
    //     }else{
    //       $scope.listCtrl.handle(tarefaSalva);
    //     }
        
    //     $scope.formCtrl.close();

    //   },
    //   (error) => {
    //     console.error("Ocorreu um erro ao salvar a tarefa:", error);
    //     console.log(tarefa);
    //     tarefa.errosDoServidor = error.data.errors;
    //   });
    // },

    // excluirTarefa: (tarefa)=>{
    //   $http.delete("/tarefas/" + tarefa.id + ".json")
    //   .then(
    //     (response) => {
    //       console.log("Tarefa excluída com sucesso");
    //       const index = $scope.listCtrl.tarefas.indexOf(tarefa);
    //       if (index > -1) {
    //         $scope.listCtrl.tarefas.splice(index, 1);
    //       }
          
    //       tarefa.editando = false
    //       $scope.formCtrl.ativo = false
    //     },
    //     (error) => {
    //       console.error("Ocorreu um erro ao excluir a tarefa:", error);
    //       alert("Não foi possível excluir a tarefa. Tente novamente.");
    //     }
    //   );
    // }
  }

  init();
});
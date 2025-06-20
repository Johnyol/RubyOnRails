import jquery from 'jquery'
window.$ = jquery
window.jquery = jquery
import "@hotwired/turbo-rails"
import "controllers"


function init(){
  fetchAndDisplayTasks(); 
  initEventos();
};

angular.module('meuApp', []).controller('MeuController', function($scope) {

});

// function mostrarNovaTarefa() {
//   const acc = document.querySelector(".accordion");
//   acc.style.display = "flex";
// }

function abrirAccordionTarefa(){
  const painel = document.getElementById("painel");
  painel.style.display = "flex";
}

function fecharAccordionTarefa(){
  painel.style.display = "none";
  const acc = document.querySelector(".accordion");
  acc.style.display = "none";
}

function accToggle(tarefaItem) {
    tarefaItem.find('.body-painel-tarefa').slideToggle(400);
}

function configTarefaEventos(novaTarefa){
  $(novaTarefa).find('.accordion-tarefa').on("click", (e)=>{
    const tarefaItem = $(e.currentTarget).closest('.card-tarefa');
    accToggle(tarefaItem);
  });

}

function initEventos(){

  $('#mostrar-nova-tarefa').on ("click", mostrarNovaTarefa);
  $('#accordion-nova-tarefa').on ("click", abrirAccordionTarefa);
  $('#fechar-nova-tarefa').on ("click", fecharAccordionTarefa);

}



async function fetchAndDisplayTasks() {
  const tasksContainer = document.getElementById('contain-tarefas');
  const Url = '/tarefas';

  if (!tasksContainer) {
    console.error('O elemento container de tarefas #contain-tarefas não foi encontrado.');
    return;
  }

  try {
    const response = await fetch(Url);
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.statusText}`);
    }
    const tasks = await response.json();

    tasksContainer.innerHTML = '';

    if (tasks.length === 0) {
      tasksContainer.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
      return;
    }

    tasks.forEach(task => {
      const novaTarefa = $('#templates .card-tarefa').clone();

      novaTarefa.find('#titulo').text(task.nome); 
      novaTarefa.find('.status-tarefa').text(task.status);
      novaTarefa.find('.custo').text(task.custo); 
      novaTarefa.find('.data_inicio').text(task.date_inicio); 
      novaTarefa.find('.data_fim').text(task.data_fim); 


     const containerComentarios = novaTarefa.find('.card-comentario-value');

      containerComentarios.empty();

      task.comentarios.forEach(comentario => {
          
     
          const novoComentarioClone = $('#templates .body-card-comentario').clone();
          
          novoComentarioClone.find('.conteudo-card').text(comentario.conteudo);
          containerComentarios.append(novoComentarioClone);
      });

      tasksContainer.append(novaTarefa[0]);

      configTarefaEventos(novaTarefa);
    });


  } catch (error) {
    console.error('Falha ao buscar tarefas:', error);
    if (tasksContainer) {
      tasksContainer.innerHTML = '<p style="color: red;">Não foi possível carregar as tarefas.</p>';
    }
  }
}

document.addEventListener("turbo:load", () => {
  init();
});
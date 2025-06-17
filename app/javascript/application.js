import jquery from 'jquery'
window.$ = jquery
window.jquery = jquery
import "@hotwired/turbo-rails"
import "controllers"


function init(){
  fetchAndDisplayTasks(); 
  configEventos();
};


function mostrarFormulario() {
  const acc = document.querySelector(".accordion");
  acc.style.display = "flex";
}

function abrirForm(){
  const painel = document.getElementById("painel");
  painel.style.display = "flex";
}

function fecharForm(){
  painel.style.display = "none"
  acc.style.display = "none"
}

function AccToggle(TarefaItem) {
    TarefaItem.find('.body-painel-tarefa').slideToggle(400);
}

function configEventos(){
  $('.contain-acordion-tarefa').on("click", (e)=>{
    const TarefaItem = $(e.currentTarget).closest('.card-tarefa');
    AccToggle(TarefaItem);
  });

  $('#show-card-form').on ("click", mostrarFormulario);
  $('#accordion').on ("click", abrirForm);
  $('#closeForm').on ("click", fecharForm);

}


async function fetchAndDisplayTasks() {
  const tasksContainer = document.getElementById('contain-tarefas');
  const Url = '/tarefas'; 

  if (!tasksContainer) {
    return;
  }

  try {
    const response = await fetch(Url);
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.statusText}`);
    }
    const tasks = await response.json();
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    
    tasksContainer.innerHTML = ''; 
    
    if (tasks.length === 0) {
      tasksContainer.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
      return;
    }
    
    const tasksHtml = tasks.map(task => {
      const comentariosHtml = (task.comentarios || []).map(comentario => `
        <div class="card-comentario-value">
          <div class="body-card-comentario">
            <div class="conteudo-card">${comentario.conteudo}</div>
          </div>
          <div class="delete-comentario">
            <i class="fa-solid fa-trash"></i>
          </div>
        </div>
      `).join('');

      return `
      <div class="card-tarefa">
        <div class="contain-acordion-tarefa">
          <button class="accordion-tarefa" id="accordion-tarefa">
            <div class="contain-angle">
              <div class="angle"><i class="fa-solid fa-angle-right"></i></div>
              <span>${task.nome}</span>
            </div>
            <span class="contain-edit-tarefa">
              <a href="/tarefas/${task.id}/edit" class="edit-link"><i class="fa-solid fa-pencil"></i></a>
            </span>
          </button>
        </div>
        <div class="body-painel-tarefa">
          <div class="painel-tarefa-comentario">
            <div class="contain-values-task">
              <div class="span-values-date">
                <span>Inicio</span>
                <div class="data-span"><p>${task.date_inicio || 'N/A'}</p></div>
              </div>
              <div class="span-values-date">
                <span>Conclusão</span>
                <div class="data-span"><p>${task.data_fim || 'N/A'}</p></div>
              </div>
            </div>
            <div class="contain-values-custo">
              <div class="span-values-custo">
                <span> Custo Estimado</span>
                <div class="icon"><i class="fa-solid fa-brazilian-real-sign"></i> ${task.custo || 0.00}</div> 
              </div>
              <div class="span-values-custo">
                <span> Status da Tarefa </span> ${task.status || 'Não definido'}
              </div>
            </div>
          </div>

          <div class="contain-comentarios" id="painel-comentarios">
            <div class="card-nav-comentario"> <i class="fa-solid fa-comments"></i> Comentários </div>
              <div class="painel-contain-comentario">
                ${comentariosHtml}
                <div class="contain-form-comentario">
                  <form action="/tarefas/${task.id}/comentarios" method="post">
                    <input type="hidden" name="authenticity_token" value="${csrfToken}">
                    <textarea name="comentario[conteudo]" placeholder="Adicione um comentário..."></textarea>
                    <div class="enviar-form-comentario">
                      <button type="submit">
                        <i class="fa-solid fa-envelope"></i>
                        Enviar comentario
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');
    
    tasksContainer.innerHTML = tasksHtml;

    configEventos();

  } catch (error) {
    console.error('Falha ao buscar tarefas:', error);
    if(tasksContainer){
      tasksContainer.innerHTML = '<p style="color: red;">Não foi possível carregar as tarefas.</p>';
    }
  }
}


document.addEventListener("turbo:load", () => {
  init();
});
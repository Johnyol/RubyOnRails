import "@hotwired/turbo-rails"
import "jquery"
import "controllers"

function ativarAccordionsTarefa() {
  const accordions_tarefa = document.querySelectorAll(".accordion-tarefa");

  accordions_tarefa.forEach((acc) => {
    const seta = acc.querySelector(".fa-angle-right");

    if (acc && seta) {
      acc.addEventListener("click", function () {
        const tarefaId = acc.dataset.tarefaId;
        const painel_tarefa_comentario = document.getElementById(`painel-tarefa-comentario-${tarefaId}`);
        const painel_comentarios = document.getElementById(`painel-comentarios-${tarefaId}`);
        const current = seta.style.transform;
        seta.style.transform = current === "rotate(90deg)" ? "rotate(0deg)" : "rotate(90deg)";

        if (painel_tarefa_comentario) {
          painel_tarefa_comentario.style.display = painel_tarefa_comentario.style.display === "block" ? "none" : "block";
        }
        if (painel_comentarios) {
          painel_comentarios.style.display = painel_comentarios.style.display === "block" ? "none" : "block";
        }
      });
    }
  });
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
        </div>
      `).join('');

      return `
        <div class="contain-acordion-tarefa">
          <button class="accordion-tarefa" data-tarefa-id="${task.id}">
            <div class="contain-angle">
              <div class="angle"><i class="fa-solid fa-angle-right"></i></div>
              <span>${task.nome}</span>
            </div>
            <span class="contain-edit-tarefa">
              <a href="/tarefas/${task.id}/edit" class="edit-link">
                <i class="fa-solid fa-pencil"></i>
              </a>
            </span>
          </button>
        </div>

        <div class="painel-tarefa-comentario" id="painel-tarefa-comentario-${task.id}">
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

        <div class="contain-comentarios" id="painel-comentarios-${task.id}">
          <div class="card-nav-comentario"> <i class="fa-solid fa-comments"></i> Comentários </div>
          <div class="painel-contain-comentario">
            ${comentariosHtml}
            
            <div class="contain-form-comentario">
              <form action="/tarefas/${task.id}/comentarios" method="post">
                <input type="hidden" name="authenticity_token" value="${csrfToken}">
                
                <textarea name="comentario[conteudo]" placeholder="Adicione um comentário..."></textarea>
                
                <button type="submit" class="enviar-form-comentario">
                  <i class="fa-solid fa-envelope"></i>Enviar comentario
                </button>
              </form>
            </div>
            </div>
        </div>
      `;
    }).join('');
    
    tasksContainer.innerHTML = tasksHtml;

    ativarAccordionsTarefa();

  } catch (error) {
    console.error('Falha ao buscar tarefas:', error);
    if(tasksContainer){
      tasksContainer.innerHTML = '<p style="color: red;">Não foi possível carregar as tarefas.</p>';
    }
  }
}


document.addEventListener("turbo:load", () => {

  fetchAndDisplayTasks();

});

function mostrarFormulario() {
  const accordions = document.querySelectorAll(".accordion");
  accordions.forEach((acc) => {
    acc.style.display = "flex";
  });
}

function abrirFormularioETarefa() {
  mostrarFormulario();
  const painelPrincipal = document.getElementById("painel");
  if (painelPrincipal) {
    painelPrincipal.style.display = painelPrincipal.style.display === "block" ? "none" : "block";
  }
}

function fecharFormulario() {
  const painelPrincipal = document.getElementById("painel");
  painelPrincipal.style.display = "none";
}

// Expondo funções para serem usadas em `onclick` no HTML
window.fecharFormulario = fecharFormulario;
window.mostrarFormulario = mostrarFormulario;
window.abrirFormularioETarefa = abrirFormularioETarefa;
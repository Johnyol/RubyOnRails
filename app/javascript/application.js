import "@hotwired/turbo-rails"
import "jquery"
import "controllers"

function ativarAccordionsTarefa() {
  const accordions_tarefa = document.querySelectorAll(".accordion");

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

document.addEventListener("turbo:load", () => {
  ativarAccordionsTarefa();
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


window.fecharFormulario = fecharFormulario;
window.mostrarFormulario = mostrarFormulario;
window.abrirFormularioETarefa = abrirFormularioETarefa;
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  // Define os 'targets' que vamos manipular: o painel e o ícone.
  static targets = [ "panel", "icon" ]
  // Define os 'values' que o controller pode receber do HTML.
  static values = { startOpen: Boolean }

  connect() {
    // Esta função é executada assim que o controlador é conectado ao DOM.
    // Verificamos se o valor startOpenValue (passado do Rails) é true.
    if (this.startOpenValue) {
      this.open(); // Se for, já abrimos o acordeão.
    }
  }

  toggle() {
    // Função para alternar a visibilidade.
    if (this.panelTarget.classList.contains("hidden")) {
      this.open();
    } else {
      this.close();
    }
  }
  
  open() {
    this.panelTarget.classList.remove("hidden");
    this.iconTarget.classList.remove("fa-angle-right");
    this.iconTarget.classList.add("fa-angle-down");
  }

  close() {
    this.panelTarget.classList.add("hidden");
    this.iconTarget.classList.add("fa-angle-right");
    this.iconTarget.classList.remove("fa-angle-down");
  }
}
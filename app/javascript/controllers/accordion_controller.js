import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
 
  static targets = [ "panel", "icon" ]
  static values = { startOpen: Boolean }

  connect() {
   
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
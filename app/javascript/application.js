// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

const acc = document.querySelector(".accordion");
const painel = document.getElementById('painel');
const seta = document.getElementById('angle');


acc.addEventListener("click", function () {
  const current = seta.style.transform;
  if (current === 'rotate(90deg)') {
    seta.style.transform = 'rotate(0deg)';
  } else {
    seta.style.transform = 'rotate(90deg)';
  }

  painel.style.display = painel.style.display === "block" ? "none" : "block";
});





// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const loading = document.querySelector('.loading');
  const modelo = document.querySelector("#modelo3d-1");
  const target = document.querySelector('a-entity[mindar-image-target]');

  // Função para esconder loading
  function hideLoading() {
    if (loading) {
      loading.style.display = 'none';
    }
  }

  // Eventos de detecção do marcador
  if (target) {
    target.addEventListener("targetFound", () => {
      if (modelo) {
        modelo.setAttribute('visible', 'true');
        modelo.setAttribute('scale', '8 8 8');
        hideLoading();
      }
    });

    target.addEventListener("targetLost", () => {
      if (modelo) {
        modelo.setAttribute('visible', 'false');
      }
    });
  }

  // Esconder loading após 5 segundos (fallback)
  setTimeout(hideLoading, 5000);
});

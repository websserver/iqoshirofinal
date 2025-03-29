// Mapeamento de cores para modelos
const colorToModel = {
    'navy': 'modelo3d/modelo3_prime/navy-blazer.glb',
    'olive': 'modelo3d/modelo3_prime/olive-green.glb',
    'jacaranda': 'modelo3d/modelo3_prime/jacaranda.glb',
    'rooibos': 'modelo3d/modelo3_prime/rooibos-tea.glb',
    'turquoise': 'modelo3d/modelo3_prime/pastel-turquoise.glb'
};

// Função para trocar a cor do modelo
function changeColor(color) {
    // Atualiza a classe active nos botões de cor
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === color) {
            option.classList.add('active');
        }
    });

    // Obtém a cena A-Frame
    const scene = document.querySelector('a-scene');
    const modelContainer = document.querySelector('#modelo3d-1');
    
    if (!scene || !modelContainer) {
        return;
    }

    // Cria um novo asset para o modelo
    const modelId = `model-${color}`;
    const modelUrl = colorToModel[color];
    
    // Remove o modelo atual primeiro
    modelContainer.removeAttribute('gltf-model');
    
    // Remove o asset anterior se existir
    const oldAsset = document.querySelector(`#${modelId}`);
    if (oldAsset) {
        oldAsset.parentNode.removeChild(oldAsset);
    }
    
    // Cria um novo asset
    const newAsset = document.createElement('a-asset-item');
    newAsset.setAttribute('id', modelId);
    newAsset.setAttribute('src', modelUrl);
    
    // Adiciona listeners para monitorar o carregamento
    newAsset.addEventListener('loaded', () => {
        // Atualiza o modelo após o carregamento
        modelContainer.setAttribute('gltf-model', `#${modelId}`);
        // Reseta a posição e escala
        modelContainer.setAttribute('position', '0 0 0.1');
        modelContainer.setAttribute('scale', '8 8 8');
        modelContainer.setAttribute('rotation', '0 0 0');
        // Força a atualização da cena
        modelContainer.object3D.visible = true;
        modelContainer.object3D.updateMatrixWorld(true);
        scene.object3D.updateMatrixWorld(true);
    });
    
    // Adiciona o novo asset à cena
    scene.querySelector('a-assets').appendChild(newAsset);
    
    // Adiciona uma animação de fade
    modelContainer.setAttribute('animation', {
        property: 'opacity',
        from: 0,
        to: 1,
        dur: 500,
        easing: 'easeInOutQuad'
    });
    
    // Remove a animação após sua conclusão
    setTimeout(() => {
        modelContainer.removeAttribute('animation');
    }, 500);

    // Adiciona um listener para o evento de carregamento do modelo
    modelContainer.addEventListener('model-loaded', function() {
        // Força atualização da visibilidade
        modelContainer.object3D.visible = true;
        modelContainer.object3D.updateMatrixWorld(true);
        scene.object3D.updateMatrixWorld(true);
        
        // Verifica se o marcador está visível
        const target = document.querySelector('a-entity[mindar-image-target]');
        if (target && target.object3D.visible) {
            modelContainer.setAttribute('visible', true);
        }
    });
}

// Adiciona listener para erros de carregamento de modelo
document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    if (scene) {
        scene.addEventListener('model-loaded', (e) => {
            console.log(`Modelo carregado: ${e.detail.model.src}`);
        });
        
        scene.addEventListener('model-error', (e) => {
            console.log(`ERRO ao carregar modelo: ${e.detail.model.src}`);
            console.log(`Detalhes do erro: ${e.detail.error}`);
        });
    }
}); 
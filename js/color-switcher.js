// Mapeamento de cores para modelos
const colorToModel = {
    'navy': 'modelo3d/modelo3_prime/navy-blazer.glb',
    'olive': 'modelo3d/modelo3_prime/olive-green.glb',
    'jacaranda': 'modelo3d/modelo3_prime/jacaranda.glb',
    'rooibos': 'modelo3d/modelo3_prime/rooibos-tea.glb',
    'turquoise': 'modelo3d/modelo3_prime/pastel-turquoise.glb'
};

// Função para criar elemento de log
function createLogElement() {
    let logDiv = document.getElementById('model-loading-log');
    if (!logDiv) {
        logDiv = document.createElement('div');
        logDiv.id = 'model-loading-log';
        logDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 14px;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            border: 2px solid #00A0DC;
        `;
        document.body.appendChild(logDiv);

        // Adiciona botão para mostrar/esconder logs
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-logs';
        toggleButton.textContent = '🔍 Logs';
        toggleButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00A0DC;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        toggleButton.onclick = () => {
            logDiv.style.display = logDiv.style.display === 'none' ? 'block' : 'none';
            toggleButton.textContent = logDiv.style.display === 'none' ? '🔍 Logs' : '❌ Fechar';
        };
        document.body.appendChild(toggleButton);
    }
    return logDiv;
}

// Função para adicionar log
function addLog(message) {
    const logDiv = createLogElement();
    const logEntry = document.createElement('div');
    logEntry.style.cssText = `
        margin-bottom: 8px;
        padding: 5px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    `;
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logDiv.appendChild(logEntry);
    logDiv.scrollTop = logDiv.scrollHeight;
}

// Função para trocar a cor do modelo
function changeColor(color) {
    addLog(`Iniciando troca de cor para: ${color}`);
    
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
        addLog('ERRO: Cena ou container do modelo não encontrado');
        return;
    }

    // Cria um novo asset para o modelo
    const modelId = `model-${color}`;
    const modelUrl = colorToModel[color];
    
    addLog(`Carregando modelo: ${modelUrl}`);
    
    // Remove o modelo atual primeiro
    modelContainer.removeAttribute('gltf-model');
    
    // Remove o asset anterior se existir
    const oldAsset = document.querySelector(`#${modelId}`);
    if (oldAsset) {
        oldAsset.parentNode.removeChild(oldAsset);
        addLog(`Asset anterior removido: ${modelId}`);
    }
    
    // Cria um novo asset
    const newAsset = document.createElement('a-asset-item');
    newAsset.setAttribute('id', modelId);
    newAsset.setAttribute('src', modelUrl);
    
    // Adiciona listeners para monitorar o carregamento
    newAsset.addEventListener('loaded', () => {
        addLog(`Modelo carregado com sucesso: ${modelUrl}`);
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
    
    newAsset.addEventListener('error', (error) => {
        addLog(`ERRO ao carregar modelo: ${modelUrl}`);
        addLog(`Detalhes do erro: ${error.message}`);
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
        addLog(`Modelo aplicado e visível: ${modelUrl}`);
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
            addLog(`Modelo carregado: ${e.detail.model.src}`);
        });
        
        scene.addEventListener('model-error', (e) => {
            addLog(`ERRO ao carregar modelo: ${e.detail.model.src}`);
            addLog(`Detalhes do erro: ${e.detail.error}`);
        });
    }
}); 
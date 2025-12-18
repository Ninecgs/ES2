# 📋 Exemplo de Expansão do SAPEA

Este documento mostra como adicionar novas funcionalidades ao sistema.

## Exemplo: Adicionar Tela de Gestão de Rotina

### 1. Adicionar HTML (em index.html)

```html
<!-- Painel de Gestão de Rotina -->
<div id="rotina-manager-screen" class="screen">
    <header class="dashboard-header">
        <button class="btn-icon" onclick="showScreen('escola-screen')" aria-label="Voltar">
            ← Voltar
        </button>
        <h1 class="dashboard-title">Gerenciar Rotina</h1>
    </header>
    
    <main class="dashboard-main">
        <section class="routine-form-card">
            <h2 class="card-title">Nova Atividade</h2>
            <form id="routine-form" onsubmit="saveRoutine(event)">
                <div class="form-group">
                    <label for="activity-name" class="form-label">Nome da Atividade</label>
                    <input type="text" id="activity-name" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label for="activity-time" class="form-label">Horário</label>
                    <input type="time" id="activity-time" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label for="activity-risk" class="form-label">Nível de Risco</label>
                    <select id="activity-risk" class="form-select">
                        <option value="low">Baixo</option>
                        <option value="medium">Médio</option>
                        <option value="high">Alto</option>
                    </select>
                </div>
                
                <button type="submit" class="btn btn-primary btn-large">Salvar Atividade</button>
            </form>
        </section>
        
        <section class="routine-list-card">
            <h2 class="card-title">Atividades do Dia</h2>
            <div id="routine-list">
                <!-- Lista será gerada via JavaScript -->
            </div>
        </section>
    </main>
</div>
```

### 2. Adicionar Estilos (em css/main.css)

```css
.routine-form-card,
.routine-list-card {
    background-color: var(--color-bg-secondary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    box-shadow: var(--shadow-sm);
}

.routine-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--color-bg);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-sm);
    border-left: 4px solid;
}

.routine-item.risk-low {
    border-color: var(--color-success);
}

.routine-item.risk-medium {
    border-color: var(--color-warning);
}

.routine-item.risk-high {
    border-color: var(--color-danger);
}
```

### 3. Adicionar JavaScript (em js/main.js)

```javascript
// Armazenamento de rotinas (em produção, viria do backend)
let routines = [];

function showRoutineManager() {
    showScreen('rotina-manager-screen');
    loadRoutines();
}

function saveRoutine(event) {
    event.preventDefault();
    
    const routine = {
        id: Date.now(),
        name: document.getElementById('activity-name').value,
        time: document.getElementById('activity-time').value,
        risk: document.getElementById('activity-risk').value
    };
    
    routines.push(routine);
    routines.sort((a, b) => a.time.localeCompare(b.time));
    
    // Salvar no localStorage (em produção, seria API)
    localStorage.setItem('sapea_routines', JSON.stringify(routines));
    
    // Limpar formulário
    document.getElementById('routine-form').reset();
    
    // Atualizar lista
    loadRoutines();
    
    showNotification('Atividade salva com sucesso!', 'success');
}

function loadRoutines() {
    const saved = localStorage.getItem('sapea_routines');
    if (saved) {
        routines = JSON.parse(saved);
    }
    
    const listContainer = document.getElementById('routine-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    if (routines.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light);">Nenhuma atividade cadastrada</p>';
        return;
    }
    
    routines.forEach(routine => {
        const item = document.createElement('div');
        item.className = `routine-item risk-${routine.risk}`;
        item.innerHTML = `
            <div>
                <p style="font-weight: 600; margin-bottom: 4px;">${routine.name}</p>
                <p style="font-size: 0.875rem; color: var(--color-text-light);">${routine.time}</p>
            </div>
            <button class="btn btn-secondary" onclick="deleteRoutine(${routine.id})">Remover</button>
        `;
        listContainer.appendChild(item);
    });
}

function deleteRoutine(id) {
    if (confirm('Tem certeza que deseja remover esta atividade?')) {
        routines = routines.filter(r => r.id !== id);
        localStorage.setItem('sapea_routines', JSON.stringify(routines));
        loadRoutines();
        showNotification('Atividade removida', 'success');
    }
}
```

## Exemplo: Adicionar Sistema de Notificações

### JavaScript para Notificações Push (exemplo)

```javascript
// Solicitar permissão para notificações
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Notificações ativadas!', 'success');
            }
        });
    }
}

// Enviar notificação
function sendNotification(title, body, icon = '🔔') {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: icon,
            badge: '/icon-192x192.png',
            tag: 'sapea-notification'
        });
    }
}

// Exemplo: Notificar sobre transição próxima
function checkUpcomingTransitions() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    routines.forEach(routine => {
        const [hours, minutes] = routine.time.split(':');
        const routineTime = parseInt(hours) * 60 + parseInt(minutes);
        const timeUntil = routineTime - currentTime;
        
        // Notificar 15 minutos antes
        if (timeUntil === 15) {
            sendNotification(
                'Transição Próxima',
                `${routine.name} em 15 minutos`,
                '⏰'
            );
        }
    });
}

// Verificar a cada minuto
setInterval(checkUpcomingTransitions, 60000);
```

## Exemplo: Integração com API

### Estrutura de API REST

```javascript
// api.js
const API_BASE_URL = 'https://api.sapea.com.br/v1';

async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('sapea_token');
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Erro ao conectar com o servidor', 'danger');
        throw error;
    }
}

// Exemplos de uso
async function getRoutines(childId) {
    return await apiRequest(`/children/${childId}/routines`);
}

async function saveRoutine(childId, routine) {
    return await apiRequest(`/children/${childId}/routines`, 'POST', routine);
}

async function registerCrisis(childId, crisisData) {
    return await apiRequest(`/children/${childId}/crises`, 'POST', crisisData);
}

async function getCrisisHistory(childId) {
    return await apiRequest(`/children/${childId}/crises`);
}
```

## Exemplo: Upload de Imagens

### HTML

```html
<div class="upload-area" id="upload-area">
    <input type="file" id="image-upload" accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
    <label for="image-upload" class="upload-label">
        <span class="upload-icon">📷</span>
        <span>Clique para adicionar foto do ambiente</span>
    </label>
</div>

<div id="image-preview" class="image-preview"></div>
```

### CSS

```css
.upload-area {
    border: 2px dashed var(--color-border);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-xl);
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.upload-area:hover {
    border-color: var(--color-primary);
    background-color: rgba(123, 154, 204, 0.05);
}

.upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
}

.upload-icon {
    font-size: 3rem;
}

.image-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
}

.preview-item {
    position: relative;
    border-radius: var(--border-radius-md);
    overflow: hidden;
}

.preview-item img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.preview-item button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: var(--border-radius-full);
    width: 32px;
    height: 32px;
    cursor: pointer;
}
```

### JavaScript

```javascript
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecione uma imagem', 'warning');
        return;
    }
    
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Imagem muito grande. Máximo 5MB', 'warning');
        return;
    }
    
    // Ler e exibir preview
    const reader = new FileReader();
    reader.onload = (e) => {
        displayImagePreview(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
}

function displayImagePreview(imageSrc, fileName) {
    const preview = document.getElementById('image-preview');
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.innerHTML = `
        <img src="${imageSrc}" alt="${fileName}">
        <button onclick="removeImagePreview(this)" aria-label="Remover imagem">✕</button>
    `;
    preview.appendChild(item);
    
    // Em produção, aqui você faria upload para o servidor
    // uploadToServer(imageSrc, fileName);
}

function removeImagePreview(button) {
    button.closest('.preview-item').remove();
}
```

## Dicas de Implementação

1. **Validação**: Sempre valide dados no frontend E backend
2. **Feedback**: Forneça feedback visual para todas as ações
3. **Erros**: Trate erros de forma amigável
4. **Performance**: Use lazy loading para imagens
5. **Acessibilidade**: Mantenha ARIA labels e navegação por teclado
6. **Segurança**: Nunca confie apenas no frontend para validações críticas

---

Estes são exemplos de como expandir o sistema. Adapte conforme suas necessidades específicas! 🚀


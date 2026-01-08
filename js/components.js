// Variáveis de Visualização
let viewDate = new Date();
let idToDelete = null;

// --- NAVEGAÇÃO DE MÊS ---
function changeViewMonth(delta) {
    viewDate.setMonth(viewDate.getMonth() + delta);
    updateViewDisplay();
    updateDashboard(); // Essa função estará no app.js
}

function updateViewDisplay() {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const display = document.getElementById('currentMonthDisplay');
    if(display) {
        display.innerText = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    }
}

// --- MODAL DE CONFIRMAÇÃO ---
function createModalHTML() {
    // Evita criar duplicado
    if(document.getElementById('deleteModalOverlay')) return;

    const div = document.createElement('div');
    div.id = 'deleteModalOverlay';
    div.className = 'modal-overlay';
    div.innerHTML = `
        <div class="custom-modal">
            <h3 class="modal-title">Tem certeza que deseja apagar este registro?</h3>
            <div class="modal-btns">
                <button class="m-btn cancel" onclick="closeModal()">Cancelar</button>
                <button class="m-btn confirm" onclick="confirmDelete()">Confirmar Exclusão</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);
}

function askDelete(id) {
    idToDelete = id;
    document.getElementById('deleteModalOverlay').classList.add('open');
}

function closeModal() {
    document.getElementById('deleteModalOverlay').classList.remove('open');
    idToDelete = null;
}

function confirmDelete() {
    if(idToDelete !== null) {
        // Acessa a variável global transactions do data.js
        transactions = transactions.filter(t => t.id !== idToDelete);
        saveData();
        updateDashboard();
        showToast("Registro apagado.", "info");
        closeModal();
    }
}
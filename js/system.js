let currentType = 'income';
let transactions = [];
let editingId = null;
let idToDelete = null; // Guarda o ID para deletar após confirmação

// VARIÁVEIS DE DATA
let viewDate = new Date();
let inputDate = new Date();

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia Componentes
    document.getElementById('dateInput').valueAsDate = new Date();
    loadData();
    updateViewDisplay();
    updateDashboard();
    initChart();
    
    // 2. Inicia Matrix de Fundo
    initDashMatrix();

    // 3. Cria a Janela de Confirmação (Modal) automaticamente no HTML
    createModalHTML();
});

// --- FUNÇÃO DO EFEITO MATRIX ---
function initDashMatrix() {
    const canvas = document.getElementById('dashMatrix');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = '01XYZ<>{}/*-+qwerty@#';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00F2FF'; 
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 50);
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}

// --- SISTEMA DE NOTIFICAÇÃO (TOAST) ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = 'fa-info-circle';
    if(type === 'success') icon = 'fa-check-circle';
    if(type === 'error') icon = 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// --- SISTEMA DE CONFIRMAÇÃO (MODAL) ---
function createModalHTML() {
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
    const modal = document.getElementById('deleteModalOverlay');
    modal.classList.add('open');
}

function closeModal() {
    const modal = document.getElementById('deleteModalOverlay');
    modal.classList.remove('open');
    idToDelete = null;
}

function confirmDelete() {
    if(idToDelete !== null) {
        transactions = transactions.filter(t => t.id !== idToDelete);
        saveData();
        updateDashboard();
        showToast("Registro apagado.", "info");
        closeModal();
    }
}


// --- CONTROLES E LÓGICA DO SISTEMA ---
function changeViewMonth(delta) {
    viewDate.setMonth(viewDate.getMonth() + delta);
    updateViewDisplay();
    updateDashboard();
}

function updateViewDisplay() {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const display = document.getElementById('currentMonthDisplay');
    if(display) display.innerText = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
}

function selectType(type) {
    currentType = type;
    document.querySelectorAll('.type-opt').forEach(el => el.classList.remove('active'));
    document.querySelector(`.type-opt[data-type="${type}"]`).classList.add('active');
}

function handleTransactionSubmit() {
    const desc = document.getElementById('descInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const category = document.getElementById('catInput').value;
    const dateRaw = document.getElementById('dateInput').value;

    if(!desc || isNaN(amount) || amount <= 0 || !dateRaw) {
        showToast("Preencha todos os campos corretamente.", "error");
        return;
    }

    const [year, month, day] = dateRaw.split('-').map(Number);
    const txDateStr = new Date(year, month - 1, day).toISOString();

    if(editingId) {
        const index = transactions.findIndex(t => t.id === editingId);
        if(index !== -1) {
            transactions[index] = { ...transactions[index], type: currentType, desc, amount, category, date: txDateStr };
        }
        showToast("Registro atualizado!", "success");
        cancelEdit();
    } else {
        const newTx = {
            id: Date.now(),
            type: currentType,
            desc,
            amount,
            category,
            date: txDateStr
        };
        transactions.unshift(newTx);
        showToast("Registro salvo!", "success");
        
        document.getElementById('descInput').value = '';
        document.getElementById('amountInput').value = '';
    }

    saveData();
    updateDashboard();
}

function editTransaction(id) {
    const tx = transactions.find(t => t.id === id);
    if(!tx) return;
    editingId = id;
    document.getElementById('descInput').value = tx.desc;
    document.getElementById('amountInput').value = tx.amount;
    document.getElementById('catInput').value = tx.category;
    document.getElementById('dateInput').value = tx.date.split('T')[0];
    selectType(tx.type);
    const btn = document.getElementById('mainBtn');
    btn.innerHTML = '<i class="fa-solid fa-rotate"></i> ATUALIZAR';
    btn.classList.add('editing');
    document.getElementById('cancelEditArea').style.display = 'block';
    showToast("Editando registro...", "info");
}

function cancelEdit() {
    editingId = null;
    document.getElementById('descInput').value = '';
    document.getElementById('amountInput').value = '';
    const btn = document.getElementById('mainBtn');
    btn.innerHTML = '<i class="fa-solid fa-fingerprint"></i> REGISTRAR';
    btn.classList.remove('editing');
    document.getElementById('cancelEditArea').style.display = 'none';
}

// Substituindo o delete antigo pelo novo sistema de modal
function deleteTransaction(id) {
    askDelete(id);
}

function saveData() { localStorage.setItem('financeOS_v5', JSON.stringify(transactions)); }
function loadData() {
    const data = localStorage.getItem('financeOS_v5');
    if(data) transactions = JSON.parse(data);
}

function updateDashboard() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    let incTotal = 0, expTotal = 0;
    const filteredTx = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === viewDate.getMonth() && tDate.getFullYear() === viewDate.getFullYear();
    });

    if(filteredTx.length === 0) {
        list.innerHTML = '<div style="text-align:center; color:#666; padding:20px; font-size:0.9rem;">Nenhum registro neste mês.</div>';
    }

    filteredTx.forEach(t => {
        if(t.type === 'income') incTotal += t.amount; else expTotal += t.amount;
        const el = document.createElement('div');
        el.className = `tx-item ${t.type}`;
        
        let icon = 'fa-wallet';
        if(t.category === 'house') icon = 'fa-house';
        if(t.category === 'utensils') icon = 'fa-utensils';
        if(t.category === 'car') icon = 'fa-car';
        if(t.category === 'gamepad') icon = 'fa-gamepad';
        if(t.category === 'briefcase') icon = 'fa-briefcase';

        const dateObj = new Date(t.date);
        const dateStr = dateObj.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'});

        el.innerHTML = `
            <div class="tx-left">
                <div class="tx-cat-icon"><i class="fa-solid ${icon}"></i></div>
                <div class="tx-info"><h4>${t.desc}</h4><span>${dateStr}</span></div>
            </div>
            <div class="tx-right">
                <span class="tx-val ${t.type === 'income' ? 'green-txt' : 'red-txt'}">
                    ${t.type === 'income' ? '+' : '-'} R$ ${t.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </span>
                <div>
                    <button class="action-btn btn-edit" onclick="editTransaction(${t.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn btn-del" onclick="deleteTransaction(${t.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        list.appendChild(el);
    });

    const balance = incTotal - expTotal;
    document.getElementById('totalBalance').innerText = balance.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
    document.getElementById('totalExpense').innerText = expTotal.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
    updateChart(incTotal, expTotal);
}

let myChart;
function initChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    Chart.defaults.font.family = 'Montserrat';
    Chart.defaults.color = '#666';
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Saídas'],
            datasets: [{ data: [0, 0], backgroundColor: ['#00d26a', '#ff4757'], borderWidth: 0, hoverOffset: 4 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '75%',
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
        }
    });
}
function updateChart(inc, exp) {
    if(myChart) {
        if(inc === 0 && exp === 0) {
            myChart.data.datasets[0].data = [1];
            myChart.data.datasets[0].backgroundColor = ['#222'];
        } else {
            myChart.data.datasets[0].data = [inc, exp];
            myChart.data.datasets[0].backgroundColor = ['#00d26a', '#ff4757'];
        }
        myChart.update();
    }
}
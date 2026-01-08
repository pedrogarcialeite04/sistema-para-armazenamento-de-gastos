// Função Principal de Inicialização
function initApp() {
    // Define input de data como hoje
    const dateInput = document.getElementById('dateInput');
    if(dateInput) dateInput.valueAsDate = new Date();
    
    loadData();
    updateViewDisplay();
    updateDashboard();
    initChart();
    initDashMatrix(); // do effects.js
    createModalHTML(); // do components.js
}

// Se o usuário atualizar a página e já estiver logado (opcional) ou para testes
// document.addEventListener('DOMContentLoaded', initApp); 
// Nota: No seu fluxo atual, o initApp é chamado pelo auth.js após a animação.

// --- LÓGICA DE TRANSAÇÃO ---
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

function deleteTransaction(id) {
    // Chama o modal do components.js
    askDelete(id);
}

// --- ATUALIZAÇÃO DA TELA (RENDER) ---
function updateDashboard() {
    const list = document.getElementById('historyList');
    if(!list) return;
    
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
        const dateStr = formatDate(t.date); // usa utils.js

        el.innerHTML = `
            <div class="tx-left">
                <div class="tx-cat-icon"><i class="fa-solid ${icon}"></i></div>
                <div class="tx-info"><h4>${t.desc}</h4><span>${dateStr}</span></div>
            </div>
            <div class="tx-right">
                <span class="tx-val ${t.type === 'income' ? 'green-txt' : 'red-txt'}">
                    ${t.type === 'income' ? '+' : '-'} ${formatCurrency(t.amount)}
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
    document.getElementById('totalBalance').innerText = formatCurrency(balance);
    document.getElementById('totalExpense').innerText = formatCurrency(expTotal);

    updateChart(incTotal, expTotal);
}
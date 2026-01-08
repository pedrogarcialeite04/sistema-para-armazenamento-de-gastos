// Variáveis Globais de Dados
let transactions = [];
let currentType = 'income';
let editingId = null;

// Funções de Banco de Dados Local
function saveData() {
    localStorage.setItem('financeOS_v5', JSON.stringify(transactions));
}

function loadData() {
    const data = localStorage.getItem('financeOS_v5');
    if(data) transactions = JSON.parse(data);
}
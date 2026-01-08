// ELEMENTOS DO LOGIN
const body = document.body;
const sceneLogin = document.getElementById('sceneLogin');
const sceneWelcome = document.getElementById('sceneWelcome');
const sceneDashboard = document.getElementById('sceneDashboard');
const loginForm = document.getElementById('loginForm');

// EFEITO MATRIX
const canvas = document.getElementById('codeMatrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}function()var;if';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00F2FF';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
let matrixInterval;

// LOGICA DO LOGIN
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('userInput').value.toUpperCase();
    const p = document.getElementById('passInput').value;

    if(u === 'PEDRO' && p === '1') {
        document.querySelector('.btn-enter').classList.add('animating');
        
        setTimeout(() => {
            body.classList.add('dark-mode');
            sceneLogin.classList.add('fade-out');
            sceneWelcome.classList.add('active');

            // INICIA MATRIX
            matrixInterval = setInterval(drawMatrix, 35);

            // TRANSIÇÃO DE FASES
            setTimeout(() => {
                sceneWelcome.classList.add('warp-speed'); 
                
                setTimeout(() => {
                    clearInterval(matrixInterval); 
                    sceneWelcome.classList.add('finished'); // Sai da frente
                    sceneDashboard.classList.add('show');   // Mostra sistema
                    
                    // CHAMA FUNÇÕES DO OUTRO ARQUIVO (SYSTEM.JS)
                    if(typeof initChart === 'function') {
                        initChart();
                        updateDashboard();
                    }
                }, 800);
            }, 4000); 

        }, 600);
    } else {
        alert('ACESSO NEGADO');
    }
});
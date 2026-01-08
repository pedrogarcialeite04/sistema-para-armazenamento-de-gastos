document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Se não estiver na tela de login, para por aqui
    if(!loginForm) return;

    // Lógica Matrix do Login (diferente do Dashboard)
    const canvas = document.getElementById('codeMatrix');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}function()var;if';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        for (let x = 0; x < columns; x++) drops[x] = 1;

        function drawLoginMatrix() {
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
        
        window.matrixLoginFunc = drawLoginMatrix; // Torna acessível globalmente se precisar
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('userInput').value.toUpperCase();
        const p = document.getElementById('passInput').value;

        if(u === 'PEDRO' && p === '1') {
            document.querySelector('.btn-enter').classList.add('animating');
            
            setTimeout(() => {
                document.body.classList.add('dark-mode');
                document.getElementById('sceneLogin').classList.add('fade-out');
                const sceneWelcome = document.getElementById('sceneWelcome');
                sceneWelcome.classList.add('active');

                // Inicia Matrix
                const interval = setInterval(window.matrixLoginFunc, 35);

                setTimeout(() => {
                    sceneWelcome.classList.add('warp-speed'); 
                    
                    setTimeout(() => {
                        clearInterval(interval); 
                        sceneWelcome.classList.add('finished');
                        document.getElementById('sceneDashboard').classList.add('show');
                        
                        // Inicia o sistema principal (App)
                        if(typeof initApp === 'function') initApp();
                        
                    }, 800);
                }, 4000); 

            }, 600);
        } else {
            // Usa o Toast do utils.js se disponível, senão alert
            if(typeof showToast === 'function') showToast('Acesso Negado', 'error');
            else alert('ACESSO NEGADO');
        }
    });
});
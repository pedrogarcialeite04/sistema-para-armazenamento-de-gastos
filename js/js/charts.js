let myChart;

function initChart() {
    const ctx = document.getElementById('financeChart');
    if(!ctx) return;
    
    Chart.defaults.font.family = 'Montserrat';
    Chart.defaults.color = '#666';
    
    myChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Saídas'],
            datasets: [{ 
                data: [0, 0], 
                backgroundColor: ['#00d26a', '#ff4757'], 
                borderWidth: 0, 
                hoverOffset: 4 
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: '75%',
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
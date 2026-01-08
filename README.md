# 💸 Ultimate Finance OS 3.0

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Version](https://img.shields.io/badge/Version-3.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

> Um sistema de controle financeiro com interface futurista/cyberpunk, focado em experiência imersiva e controle de gastos pessoais.

---

## 📸 Preview

O projeto conta com uma experiência imersiva dividida em 3 cenas:
1. **Login Seguro:** Autenticação com visualização 3D (Spline).
2. **Matrix Loading:** Transição de carregamento estilo hacker.
3. **Dashboard:** Painel de controle completo com gráficos e extrato.

---

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as melhores práticas de Front-End moderno:

- **HTML5** (Semântico)
- **CSS3** (Variáveis, Flexbox, Grid, Glassmorphism, Keyframes)
- **JavaScript ES6+** (DOM Manipulation, LocalStorage API, Date Objects)
- **[Chart.js](https://www.chartjs.org/)** (Para visualização de dados em gráficos)
- **[Spline](https://spline.design/)** (Elementos 3D interativos)
- **FontAwesome** (Ícones vetoriais)

---

## ⚙️ Funcionalidades

- [x] **Autenticação Simulada:** Acesso restrito com feedback visual.
- [x] **Persistência de Dados:** Todos os registros são salvos no `LocalStorage` do navegador (não se perdem ao atualizar).
- [x] **Gráficos em Tempo Real:** O gráfico de rosca atualiza automaticamente a cada transação.
- [x] **Filtro Inteligente:** Visualize gastos por mês/ano.
- [x] **Interface Responsiva:** Funciona perfeitamente em Desktops e Dispositivos Móveis.
- [x] **Feedback Visual:** Sistema de notificações (Toasts) e Modais de confirmação personalizados.

---

## 📂 Estrutura de Pastas

```bash
finance-os-3.0/
├── css/
│   ├── animations.css
│   ├── components.css
│   ├── layout.css
│   ├── login.css
│   ├── reset.css
│   ├── responsive.css
│   └── variables.css
├── js/
│   ├── login.js
│   └── system.js
├── index.html
└── README.md
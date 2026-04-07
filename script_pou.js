let status = {
    fome: 100,
    energia: 100,
    treino: 0
};

function atualizarInterface() {
    document.getElementById('fome-fill').style.width = status.fome + "%";
    document.getElementById('energia-fill').style.width = status.energia + "%";
    document.getElementById('treino-fill').style.width = status.treino + "%";
}

// O status cai com o tempo (Gasto fixo)
setInterval(() => {
    status.fome = Math.max(0, status.fome - 1);
    status.energia = Math.max(0, status.energia - 0.5);
    atualizarInterface();
    if(status.fome < 20) alert("João está com fome!");
}, 3000);

function alimentar() {
    status.fome = Math.min(100, status.fome + 20);
    animarNinja();
    atualizarInterface();
}

function treinar() {
    if(status.energia > 10) {
        status.treino = Math.min(100, status.treino + 5);
        status.energia -= 10;
        animarNinja();
        atualizarInterface();
    } else {
        alert("João está exausto!");
    }
}

function animarNinja() {
    const el = document.getElementById('ninja-emoji');
    el.style.transform = "scale(1.3)";
    setTimeout(() => el.style.transform = "scale(1)", 200);
}

atualizarInterface();

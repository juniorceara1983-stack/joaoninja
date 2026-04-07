let status = {
    fome: 80,
    energia: 90,
    treino: 10,
    moedas: 0
};

function atualizarInterface() {
    document.getElementById('fome-fill').style.width = status.fome + "%";
    document.getElementById('energia-fill').style.width = status.energia + "%";
    document.getElementById('treino-fill').style.width = status.treino + "%";
    // Atualiza o nome para mostrar as moedas
    document.getElementById('ninja-name').innerText = `Ninja João | 💰 ${status.moedas}`;
}

// Redução automática de status
setInterval(() => {
    status.fome = Math.max(0, status.fome - 2);
    status.energia = Math.max(0, status.energia - 1);
    atualizarInterface();
}, 5000);

function alimentar() {
    if(status.fome < 100) {
        status.fome = Math.min(100, status.fome + 15);
        reagir("🍎", "😋");
    }
}

function dormir() {
    if(status.energia < 100) {
        status.energia = Math.min(100, status.energia + 30);
        reagir("💤", "😴");
    }
}

function treinar() {
    if(status.energia > 20) {
        status.treino = Math.min(100, status.treino + 10);
        status.energia -= 20;
        status.moedas += 5; // Treinar gera "faturamento"
        reagir("⚔️", "🔥");
    } else {
        alert("João está sem energia para treinar!");
    }
}

function reagir(emojiAcao, emojiRosto) {
    const el = document.getElementById('ninja-emoji');
    const original = "🥷";
    
    el.innerText = emojiRosto;
    el.style.transform = "scale(1.4) rotate(10deg)";
    
    setTimeout(() => {
        el.innerText = original;
        el.style.transform = "scale(1) rotate(0deg)";
        atualizarInterface();
    }, 8000);
}

atualizarInterface();

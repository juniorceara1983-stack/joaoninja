import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// 1. MAPA DO LABIRINTO (1=Parede, 2=Objeto, 3=João, 4=Saída)
const MAPA = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Configurações
const TAMANHO_CELULA = 2;
const VELOCIDADE_NINJA = 0.15;
const TECLAS = {};
let score = 0;
let tempoInicial = Date.now();
const objetosNoCenario = [];
let totalObjetos = 0;
let joaoNinja; // O modelo do personagem
let nomePlayer; // O elemento HTML do nome

// 2. SETUP DA CENA (THREE.JS)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luzes
const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(luzAmbiente);
const luzSol = new THREE.DirectionalLight(0xffffff, 1.0);
luzSol.position.set(10, 15, 10);
luzSol.castShadow = true;
scene.add(luzSol);

// Carregador de Texturas
const textureLoader = new THREE.TextureLoader();
// USANDO TEXTURAS DE EXEMPLO DO THREE.JS (Tijolos e Chão)
const texParede = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/brick_diffuse.jpg');
const texChao = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/hardwood2_diffuse.jpg');

// 3. CONSTRUÇÃO DO MUNDO (Com Texturas)
const geoParede = new THREE.BoxGeometry(TAMANHO_CELULA, 3.5, TAMANHO_CELULA);
const matParede = new THREE.MeshStandardMaterial({ map: texParede }); // Textura de Tijolos
const geoObjeto = new THREE.OctahedronGeometry(0.5); 
const matObjeto = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300 });

MAPA.forEach((linha, r) => {
    linha.forEach((valor, c) => {
        const x = c * TAMANHO_CELULA;
        const z = r * TAMANHO_CELULA;
        if (valor === 1) { // Parede
            const p = new THREE.Mesh(geoParede, matParede);
            p.position.set(x, 1.75, z);
            p.castShadow = true;
            p.receiveShadow = true;
            scene.add(p);
        } else if (valor === 2) { // Diamantes
            const obj = new THREE.Mesh(geoObjeto, matObjeto);
            obj.position.set(x, 1, z);
            scene.add(obj);
            objetosNoCenario.push(obj);
            totalObjetos++;
        }
    });
});

// Chão (Com textura)
const geoChao = new THREE.PlaneGeometry(100, 100);
const matChao = new THREE.MeshStandardMaterial({ map: texChao });
const chao = new THREE.Mesh(geoChao, matChao);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
scene.add(chao);

// Teto (Céu Simplificado)
const geoTeto = new THREE.PlaneGeometry(100, 100);
const matTeto = new THREE.MeshBasicMaterial({ color: 0x87CEEB }); // Azul Céu
const teto = new THREE.Mesh(geoTeto, matTeto);
teto.position.y = 3.5;
teto.rotation.x = Math.PI / 2;
scene.add(teto);

// 4. CRIAR O NINJA JOÃO
// Um corpo simples: Corpo azul (veste), cabeça (pele), faixa preta
const materialJoãoBody = new THREE.MeshStandardMaterial({ color: 0x1e90ff });
const materialJoãoHead = new THREE.MeshStandardMaterial({ color: 0xffe4b5 });
const materialJoãoFaixa = new THREE.MeshStandardMaterial({ color: 0x000000 });

joaoNinja = new THREE.Group();
// Corpo
const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.4), materialJoãoBody);
corpo.position.y = 0.6;
corpo.castShadow = true;
joaoNinja.add(corpo);
// Cabeça
const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.3), materialJoãoHead);
cabeca.position.y = 1.35;
cabeca.castShadow = true;
joaoNinja.add(cabeca);
// Faixa
const faixa = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.65), materialJoãoFaixa);
faixa.position.y = 1.4;
joaoNinja.add(faixa);

// Posição Inicial
joaoNinja.position.set(TAMANHO_CELULA * 1, 0, TAMANHO_CELULA * 1); // MATRIZ [1][1]
scene.add(joaoNinja);

// Adicionar Nome "João" acima da cabeça (HTML)
nomePlayer = document.createElement('div');
nomePlayer.className = 'player-label';
nomePlayer.textContent = 'João';
document.body.appendChild(nomePlayer);

// 5. COMBATE E AÇÕES
// Atacar de Espada ( WASD / Teclas Direcionais + ESPAÇO )
function atacarEspada() {
    // Espada é um ataque de curto alcance (raio invisível na frente do João)
    const raycaster = new THREE.Raycaster();
    const direcao = new THREE.Vector3(0, 0, 1); // Frente do João
    direcao.applyQuaternion(joaoNinja.quaternion);
    raycaster.set(joaoNinja.position.clone().add(new THREE.Vector3(0, 1, 0)), direcao);

    const intersects = raycaster.intersectObjects(objetosNoCenario);
    if (intersects.length > 0 && intersects[0].distance < 1.5) { // Distância curta
        derrubarAlvo(intersects[0].object);
    }
}

// Atacar de Shuriken ( Click na tela / Botão Shuriken )
function atacarShuriken() {
    // Shuriken é um ataque de longo alcance (direção que a câmera olha)
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const intersects = raycaster.intersectObjects(objetosNoCenario);
    if (intersects.length > 0 && intersects[0].distance < 15) { // Distância longa
        derrubarAlvo(intersects[0].object);
    }
}

function derrubarAlvo(alvo) {
    if (alvo.visible) {
        alvo.visible = false;
        score++;
        document.getElementById('score').innerText = score;
        if (score === totalObjetos) alert("Você derrubou todos os alvos, João!");
    }
}

// 6. MOVIMENTAÇÃO (PC e CELULAR)
window.addEventListener('keydown', (e) => TECLAS[e.code] = true);
window.addEventListener('keyup', (e) => TECLAS[e.code] = false);

// Configurar botões mobile (Movimento e Ação)
function configurarMobile(id, tecla, acao) {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (tecla) {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); TECLAS[tecla] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); TECLAS[tecla] = false; });
    } else if (acao) {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); acao(); });
    }
}

function podeMover(nx, nz) {
    const col = Math.round(nx / TAMANHO_CELULA);
    const row = Math.round(nz / TAMANHO_CELULA);
    if (!MAPA[row] || MAPA[row][col] === undefined) return false;
    return MAPA[row][col] !== 1; // 1 é parede
}

function atualizarControles() {
    // 6a. Movimento e Rotação do João
    let girar = 0;
    if (TECLAS['KeyW']) { /* Anda pra frente (já tratado) */ }
    if (TECLAS['KeyA']) girar = 0.05;
    if (TECLAS['KeyD']) girar = -0.05;
    
    if (girar !== 0) joaoNinja.rotation.y += girar;

    // 6b. Andar para frente/trás (Segue a rotação do João)
    const direcao = new THREE.Vector3(0, 0, 1);
    direcao.applyQuaternion(joaoNinja.quaternion);
    direcao.normalize();

    let dz = 0;
    if (TECLAS['KeyW'] || TECLAS['ArrowUp']) dz = VELOCIDADE_NINJA;
    if (TECLAS['KeyS'] || TECLAS['ArrowDown']) dz = -VELOCIDADE_NINJA;

    if (dz !== 0) {
        const nx = joaoNinja.position.x + direcao.x * dz;
        const nz = joaoNinja.position.z + direcao.z * dz;
        if (podeMover(nx, nz)) {
            joaoNinja.position.x = nx;
            joaoNinja.position.z = nz;
        }
    }

    // 6c. Atualizar Câmera (Terceira Pessoa)
    const offset = new THREE.Vector3(0, 1.8, -TAMANHO_CELULA * 1.5); // Câmera atrás e acima
    offset.applyQuaternion(joaoNinja.quaternion);
    camera.position.copy(joaoNinja.position).add(offset);
    camera.lookAt(joaoNinja.position.clone().add(new THREE.Vector3(0, 1, 0))); // Olha pro peito do João

    // 6d. Atualizar Nome (HTML segue o João)
    if (nomePlayer) {
        const tempV = joaoNinja.position.clone();
        tempV.y += 1.8; // Acima da cabeça
        tempV.project(camera);
        const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-tempV.y * 0.5 + 0.5) * window.innerHeight;
        nomePlayer.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }
}

// 7. LOOP FINAL
function animate() {
    requestAnimationFrame(animate);
    atualizarControles();
    
    // Animações dos Alvos (Diamantes verdes girando)
    objetosNoCenario.forEach(obj => { if (obj.visible) obj.rotation.y += 0.05; });
    
    const segs = Math.floor((Date.now() - tempoInicial) / 1000);
    document.getElementById('timer').innerText = segs + "s";
    
    renderer.render(scene, camera);
}

// 8. INICIALIZAÇÕES
// Teclado (Combate)
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') atacarEspada();
});
window.addEventListener('mousedown', atacarShuriken); // Clique = Shuriken

// Celular (Toque)
setTimeout(() => {
    const mapeamentoMov = [['btn-up', 'KeyW'], ['btn-down', 'KeyS'], ['btn-left', 'KeyA'], ['btn-right', 'KeyD']];
    mapeamentoMov.forEach(pair => configurarMobile(pair[0], pair[1], null));
    configurarMobile('btn-sword', null, atacarEspada);
    configurarMobile('btn-shuriken', null, atacarShuriken);
}, 500);

// Ajuste automático de janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

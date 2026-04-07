import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// 1. CONFIGURAÇÃO DA MATRIZ (O MAPA DO LABIRINTO)
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
let joaoNinjaGroup; // O grupo que contém o modelo
let joaoBones = {}; // Os ossos articulados
let nomeLabelElement; // O elemento HTML do nome
let clock = new THREE.Clock(); // Para controlar o tempo das animações

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
const luzSol = new THREE.DirectionalLight(0xffffff, 1.2);
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

// 4. CRIAR O MODELO DO NINJA JOÃO ARTICULADO
function criarNinjaArticulado() {
    joaoNinjaGroup = new THREE.Group();
    const materialJoãoBody = new THREE.MeshStandardMaterial({ color: 0x1e90ff }); // Azul
    const materialJoãoHead = new THREE.MeshStandardMaterial({ color: 0xffe4b5 }); // Bege
    const materialJoãoFaixa = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Preta
    const materialEspada = new THREE.MeshStandardMaterial({ color: 0xcccccc }); // Metal

    // Estrutura de Ossos (Hierarchy)
    // Root -> Torso -> Neck -> Head
    // Root -> Torso -> LeftUpperArm -> LeftLowerArm
    // Root -> Torso -> RightUpperArm -> RightLowerArm (Holds Sword)
    // Root -> Torso -> LeftUpperLeg -> LeftLowerLeg
    // Root -> Torso -> RightUpperLeg -> RightLowerLeg

    const root = new THREE.Group();
    joaoNinjaGroup.add(root);
    joaoBones.root = root;

    // Torso (O centro do boneco)
    const torso = new THREE.Group();
    torso.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.4), materialJoãoBody));
    root.add(torso);
    torso.position.y = 1.0;
    joaoBones.torso = torso;

    // Cabeça e Faixa
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.6; // Acima do torso
    torso.add(headGroup);
    headGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), materialJoãoHead));
    headGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.65), materialJoãoFaixa));
    joaoBones.head = headGroup;

    // Função auxiliar para criar membros articulados (Braços e Pernas)
    function criarMembro(geoMain, geoJoint, mat, posX, posY, nameUpper, nameLower) {
        const upper = new THREE.Group();
        upper.position.set(posX, posY, 0);
        upper.add(new THREE.Mesh(geoMain, mat)); // Peça principal
        
        const joint = new THREE.Group();
        joint.position.y = -geoMain.parameters.height; // Na base da peça principal
        joint.add(new THREE.Mesh(geoJoint, mat)); // Articulação
        upper.add(joint);

        const lower = new THREE.Group();
        lower.position.y = -geoJoint.parameters.height / 2; // Na base da articulação
        lower.add(new THREE.Mesh(geoMain, mat)); // Peça de baixo
        joint.add(lower);

        joaoBones[nameUpper] = upper;
        joaoBones[nameLower] = lower;
        return upper;
    }

    const geoArmPart = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const geoArmJoint = new THREE.SphereGeometry(0.1);

    // Braço Esquerdo
    torso.add(criarMembro(geoArmPart, geoArmJoint, materialJoãoBody, -0.5, 0.4, 'leftUpperArm', 'leftLowerArm'));

    // Braço Direito (Segura a Espada)
    const rightArmGroup = criarMembro(geoArmPart, geoArmJoint, materialJoãoBody, 0.5, 0.4, 'rightUpperArm', 'rightLowerArm');
    torso.add(rightArmGroup);

    // CRIAR A ESPADA (Segurada pelo Braço Direito Lower)
    const espadaHandle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), materialEspada);
    espadaHandle.position.set(0, -0.4, 0); // No final do braço inferior
    joaoBones.rightLowerArm.add(espadaHandle);
    const espadaLâmina = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.3), materialEspada);
    espadaLâmina.position.set(0, -0.6, 0.1); // Lâmina longa saindo do cabo
    espadaLâmina.rotation.z = Math.PI / 2;
    espadaHandle.add(espadaLâmina);

    // Pernas
    const geoLegPart = new THREE.BoxGeometry(0.3, 0.6, 0.3);
    const geoLegJoint = new THREE.SphereGeometry(0.15);
    joaoBones.torso.add(criarMembro(geoLegPart, geoLegJoint, materialJoãoBody, -0.3, -0.5, 'leftUpperLeg', 'leftLowerLeg'));
    joaoBones.torso.add(criarMembro(geoLegPart, geoLegJoint, materialJoãoBody, 0.3, -0.5, 'rightUpperLeg', 'rightLowerLeg'));

    joaoNinjaGroup.position.set(TAMANHO_CELULA * 1, 0, TAMANHO_CELULA * 1); // MATRIZ [1][1]
    scene.add(joaoNinjaGroup);
}

// 5. ANIMAÇÃO DE ANDAR (Walk Cycle)
function atualizarAnimaçãoAndar(tempo, estaAndando) {
    if (!joaoBones.root) return;

    // Valores padrão de pose (Standing)
    let poseParams = {
        torsoRotationX: estaAndando ? Math.sin(tempo * 2) * 0.1 : 0, // Inclinação do corpo
        armRotationX: estaAndando ? Math.PI / 4 : 0, // Braços em pose de corrida
        legRotationX: estaAndando ? Math.PI / 6 : 0, // Pernas em pose de corrida
        legLowerRotationX: estaAndando ? Math.PI / 4 : 0, // Dobra do joelho
        frequenciaRun: 8 // Velocidade do ciclo
    };

    if (estaAndando) {
        // Ciclo de corrida: Pernas e braços se movem em oposição
        const angle = tempo * poseParams.frequenciaRun;
        const sinVal = Math.sin(angle);
        const cosVal = Math.cos(angle);

        // Inclinação do corpo (Run Lean)
        joaoBones.torso.rotation.x = poseParams.torsoRotationX;

        // Pernas (Upper) - Balanço
        joaoBones.leftUpperLeg.rotation.x = sinVal * poseParams.legRotationX;
        joaoBones.rightUpperLeg.rotation.x = -sinVal * poseParams.legRotationX;

        // Joelhos (Lower) - Dobra
        joaoBones.leftLowerLeg.rotation.x = (sinVal > 0 ? sinVal : 0) * poseParams.legLowerRotationX;
        joaoBones.rightLowerLeg.rotation.x = (-sinVal > 0 ? -sinVal : 0) * poseParams.legLowerRotationX;

        // Braços (Upper) - Balanço oposto às pernas
        joaoBones.leftUpperArm.rotation.x = -sinVal * poseParams.armRotationX;
        joaoBones.rightUpperArm.rotation.x = sinVal * poseParams.armRotationX;
        
        // Braços (Lower) - Dobrados (Run pose)
        joaoBones.leftLowerArm.rotation.x = -Math.PI / 3;
        joaoBones.rightLowerArm.rotation.x = -Math.PI / 3;

        // Se estiver parado
    } else {
        // Reiniciar pose para Stand
        joaoBones.torso.rotation.x = 0;
        joaoBones.leftUpperLeg.rotation.x = 0;
        joaoBones.rightUpperLeg.rotation.x = 0;
        joaoBones.leftLowerLeg.rotation.x = 0;
        joaoBones.rightLowerLeg.rotation.x = 0;
        
        joaoBones.leftUpperArm.rotation.x = 0;
        joaoBones.rightUpperArm.rotation.x = 0;
        
        joaoBones.leftLowerArm.rotation.x = 0;
        joaoBones.rightLowerArm.rotation.x = 0;
    }
}

// 6. ADICIONAR O NOME "NINJA JOÃO" (HTML sobre o 3D)
function criarNomeLabel() {
    nomeLabelElement = document.createElement('div');
    nomeLabelElement.style.position = 'absolute';
    nomeLabelElement.style.color = '#ffffff'; // Letra Branca
    nomeLabelElement.style.padding = '4px 8px';
    nomeLabelElement.style.background = 'rgba(0, 0, 0, 0.6)'; // Fundo preto transparente
    nomeLabelElement.style.borderRadius = '4px';
    nomeLabelElement.style.fontSize = '16px';
    nomeLabelElement.style.fontFamily = 'sans-serif';
    nomeLabelElement.style.pointerEvents = 'none'; // Não atrapalha o clique
    nomeLabelElement.style.whiteSpace = 'nowrap';
    nomeLabelElement.style.border = '1px solid #00ff00'; // Borda verde ninja
    nomeLabelElement.textContent = 'Ninja João';
    document.body.appendChild(nomeLabelElement);
}

function atualizarNomeLabel() {
    if (!nomeLabelElement || !joaoNinjaGroup) return;

    // Projeta a posição 3D da cabeça na tela 2D
    const posCabeça = joaoBones.head.getWorldPosition(new THREE.Vector3());
    posCabeça.y += 0.5; // Um pouco acima da cabeça
    const posTela = posCabeça.clone().project(camera);

    const x = (posTela.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-posTela.y * 0.5 + 0.5) * window.innerHeight;

    nomeLabelElement.style.left = `${x}px`;
    nomeLabelElement.style.top = `${y}px`;
    nomeLabelElement.style.transform = `translate(-50%, -100%)`; // Centraliza
}

// 7. LÓGICA DE MOVIMENTAÇÃO E COLISÃO (Terceira Pessoa)
window.addEventListener('keydown', (e) => TECLAS[e.code] = true);
window.addEventListener('keyup', (e) => TECLAS[e.code] = false);

// Função para botões mobile (Movimento)
function configurarMobile(id, tecla) {
    const btn = document.getElementById(id);
    if(btn) {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); TECLAS[tecla] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); TECLAS[tecla] = false; });
    }
}

function podeMover(nx, nz) {
    const col = Math.round(nx / TAMANHO_CELULA);
    const row = Math.round(nz / TAMANHO_CELULA);
    if (!MAPA[row] || MAPA[row][col] === undefined) return false;
    return MAPA[row][col] !== 1; // 1 é parede
}

function atualizarControles(deltaTime) {
    if (!joaoNinjaGroup) return;

    // 7a. Movimento e Rotação do João
    let girar = 0;
    if (TECLAS['KeyW']) { /* Anda pra frente (já tratado) */ }
    if (TECLAS['KeyA'] || TECLAS['ArrowLeft']) girar = 1.0;
    if (TECLAS['KeyD'] || TECLAS['ArrowRight']) girar = -1.0;
    
    if (girar !== 0) joaoNinjaGroup.rotation.y += girar * deltaTime * 3;

    // 7b. Andar para frente/trás (Segue a rotação do João)
    const direcao = new THREE.Vector3(0, 0, 1);
    direcao.applyQuaternion(joaoNinjaGroup.quaternion);
    direcao.normalize();

    let dz = 0;
    let estaAndando = false;
    if (TECLAS['KeyW'] || TECLAS['ArrowUp']) { dz = VELOCIDADE_NINJA; estaAndando = true; }
    if (TECLAS['KeyS'] || TECLAS['ArrowDown']) { dz = -VELOCIDADE_NINJA * 0.5; estaAndando = true; } // Anda mais devagar pra trás

    if (dz !== 0) {
        const nx = joaoNinjaGroup.position.x + direcao.x * dz;
        const nz = joaoNinjaGroup.position.z + direcao.z * dz;
        if (podeMover(nx, nz)) {
            joaoNinjaGroup.position.x = nx;
            joaoNinjaGroup.position.z = nz;
        }
    }

    // 7c. Atualizar Câmera (Terceira Pessoa)
    const offset = new THREE.Vector3(0, 1.8, -TAMANHO_CELULA * 1.5); // Câmera atrás e acima
    offset.applyQuaternion(joaoNinjaGroup.quaternion);
    camera.position.copy(joaoNinjaGroup.position).add(offset);
    camera.lookAt(joaoNinjaGroup.position.clone().add(new THREE.Vector3(0, 1, 0))); // Olha pro peito do João

    // 7d. Atualizar animação de andar
    atualizarAnimaçãoAndar(clock.getElapsedTime(), estaAndando);
}

// 8. COMBATE E AÇÕES
// Atacar de Espada ( WASD / Teclas Direcionais + ESPAÇO )
function atacarEspada() {
    // Espada é um ataque de curto alcance (raio invisível na frente do João)
    const raycaster = new THREE.Raycaster();
    const direcao = new THREE.Vector3(0, 0, 1); // Frente do João
    direcao.applyQuaternion(joaoNinjaGroup.quaternion);
    raycaster.set(joaoNinjaGroup.position.clone().add(new THREE.Vector3(0, 1, 0)), direcao);

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

// 9. LOOP FINAL
function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta(); // Tempo entre frames
    
    atualizarControles(deltaTime);
    atualizarNomeLabel();

    // Animações dos Alvos (Diamantes verdes girando)
    objetosNoCenario.forEach(obj => { if (obj.visible) obj.rotation.y += 0.05; });
    
    // Atualizar HUD
    const segs = Math.floor((Date.now() - tempoInicial) / 1000);
    document.getElementById('timer').innerText = segs + "s";
    
    renderer.render(scene, camera);
}

// 10. INICIALIZAÇÕES
// PC: Teclado
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') atacarEspada();
});
window.addEventListener('mousedown', atacarShuriken); // Clique = Shuriken

// Celular: Mobile
setTimeout(() => {
    configurarMobile('btn-up', 'KeyW');
    configurarMobile('btn-down', 'KeyS');
    configurarMobile('btn-left', 'KeyA');
    configurarMobile('btn-right', 'KeyD');
    
    // Ações
    document.getElementById('btn-sword').addEventListener('touchstart', (e) => { e.preventDefault(); atacarEspada(); });
    document.getElementById('btn-shuriken').addEventListener('touchstart', (e) => { e.preventDefault(); atacarShuriken(); });
}, 500);

// Ajuste automático de janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Começar
criarNinjaArticulado();
criarNomeLabel();
animate();


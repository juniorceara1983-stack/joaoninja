import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ============================================================
// DEFINIÇÃO DOS 10 NÍVEIS
// Legenda: 0=chão  1=parede  3=início  2=objeto(verde)
//          5=objeto-guia(dourado, perto da saída)  4=saída
// Cada nível começa com 3 obj regulares + 1 guia e vai crescendo.
// Os tamanhos vão de 11×11 até 17×17.
// ============================================================
const NIVEIS = [
    // --- NÍVEL 1 — 11×11 — 3 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,0,2,0,0,1],
        [1,0,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1],
        [1,0,0,0,2,0,0,0,0,0,1],
        [1,0,1,0,1,1,0,1,1,0,1],
        [1,0,1,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,5,2,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 2 — 13×13 — 4 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,1,0,0,2,0,0,0,0,1],
        [1,0,1,0,1,1,0,1,1,1,0,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,2,0,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,1,0,1],
        [1,0,1,1,1,2,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,0,2,0,0,5,0,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 3 — 13×13 — 5 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,1,2,0,0,1,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,0,1],
        [1,0,0,2,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,0,1,1,1],
        [1,0,0,0,1,2,0,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,2,1,0,1,1,1,0,1],
        [1,0,2,0,0,0,5,0,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 4 — 13×13 — 6 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,1,0,2,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,0,1,1],
        [1,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,0,2,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,1,0,1,0,1,1,1],
        [1,2,0,0,1,0,1,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,2,1,0,0,0,1],
        [1,0,1,1,1,2,1,0,1,1,1,0,1],
        [1,0,2,0,0,0,5,0,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 5 — 15×15 — 7 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,0,2,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,2,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,2,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
        [1,0,1,0,1,2,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
        [1,0,2,0,0,2,0,0,0,5,0,2,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 6 — 15×15 — 8 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,1,0,2,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,1,0,1,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,2,0,0,0,2,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,2,0,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1],
        [1,0,0,0,1,2,0,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,2,2,0,0,0,2,0,5,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 7 — 15×15 — 9 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,2,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,1,0,0,0,0,0,0,2,1,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,2,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,2,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1],
        [1,0,0,2,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,2,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,2,0,2,2,0,0,0,5,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 8 — 17×17 — 10 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,2,0,0,1,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,1,2,0,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,2,0,0,0,0,0,0,2,0,0,1,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,2,2,0,2,0,0,0,5,0,0,0,2,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 9 — 17×17 — 11 regulares + 1 guia ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,2,0,0,0,0,0,0,0,2,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,1,2,0,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,1,1,2,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,2,0,0,0,0,2,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,2,2,0,0,0,2,0,5,0,0,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // --- NÍVEL 10 — 17×17 — 12 regulares + 1 guia (FINAL) ---
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,2,0,0,0,0,0,0,0,2,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,0,2,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,2,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,0,0,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,2,1,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,2,0,0,0,0,1,0,0,2,1,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,2,2,0,2,0,0,0,5,0,2,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
];

// ============================================================
// CONFIGURAÇÕES
// ============================================================
const TAMANHO_CELULA = 2;
const VELOCIDADE_NINJA = 0.12;

// Estado do jogo
let nivelAtual = 0;
let mapaAtual = [];
let objetosDerrubados = 0;
let totalObjetos = 0;          // regular + guia
let saidaDesbloqueada = false;
let posInicialX = 0, posInicialZ = 0;
let saidaPos = { x: 0, z: 0 };
let saidaMesh = null;
let tempoInicial = Date.now();
let jogoEncerrado = false;

const objetosNoCenario = [];   // meshes dos objetos do nível atual
const meshesDoCenario = [];    // todos os meshes do nível (paredes + objetos + portal)
const TECLAS = {};

// ============================================================
// THREE.JS — SETUP
// ============================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0010);
scene.fog = new THREE.Fog(0x0a0010, 10, 60);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luzes
const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(luzAmbiente);
const luzSol = new THREE.DirectionalLight(0xffffff, 1.2);
luzSol.position.set(10, 15, 10);
luzSol.castShadow = true;
scene.add(luzSol);

// Texturas
const textureLoader = new THREE.TextureLoader();
const texParede = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/brick_diffuse.jpg');
const texChao = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/hardwood2_diffuse.jpg');

// Geometrias e materiais compartilhados
const geoParede  = new THREE.BoxGeometry(TAMANHO_CELULA, 3.5, TAMANHO_CELULA);
const matParede  = new THREE.MeshStandardMaterial({ map: texParede });
const geoObjeto  = new THREE.OctahedronGeometry(0.5);
const matObjetoRegular = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x004411, emissiveIntensity: 0.6 });
const matObjetoGuia    = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x884400, emissiveIntensity: 0.8 });

// Chão e teto (permanentes)
const geoChao = new THREE.PlaneGeometry(200, 200);
const matChao = new THREE.MeshStandardMaterial({ map: texChao });
const chao = new THREE.Mesh(geoChao, matChao);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
scene.add(chao);

const geoTeto = new THREE.PlaneGeometry(200, 200);
const matTeto = new THREE.MeshBasicMaterial({ color: 0x110022 });
const teto = new THREE.Mesh(geoTeto, matTeto);
teto.position.y = 3.5;
teto.rotation.x = Math.PI / 2;
scene.add(teto);

// Clock
const clock = new THREE.Clock();

// ============================================================
// NINJA JOÃO — MODEL
// ============================================================
let joaoNinjaGroup;
let joaoBones = {};
let nomeLabelElement;

function criarNinjaArticulado() {
    joaoNinjaGroup = new THREE.Group();
    const matBody  = new THREE.MeshStandardMaterial({ color: 0x1e90ff });
    const matHead  = new THREE.MeshStandardMaterial({ color: 0xffe4b5 });
    const matFaixa = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const matBlade = new THREE.MeshStandardMaterial({ color: 0xcccccc });

    const root = new THREE.Group();
    joaoNinjaGroup.add(root);
    joaoBones.root = root;

    const torso = new THREE.Group();
    torso.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.4), matBody));
    root.add(torso);
    torso.position.y = 1.0;
    joaoBones.torso = torso;

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.6;
    torso.add(headGroup);
    headGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), matHead));
    headGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.65), matFaixa));
    joaoBones.head = headGroup;

    function criarMembro(geoMain, geoJoint, mat, posX, posY, nameUpper, nameLower) {
        const upper = new THREE.Group();
        upper.position.set(posX, posY, 0);
        upper.add(new THREE.Mesh(geoMain, mat));
        const joint = new THREE.Group();
        joint.position.y = -geoMain.parameters.height;
        joint.add(new THREE.Mesh(geoJoint, mat));
        upper.add(joint);
        const lower = new THREE.Group();
        lower.position.y = -geoJoint.parameters.height / 2;
        lower.add(new THREE.Mesh(geoMain, mat));
        joint.add(lower);
        joaoBones[nameUpper] = upper;
        joaoBones[nameLower] = lower;
        return upper;
    }

    const geoArmPart  = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const geoArmJoint = new THREE.SphereGeometry(0.1);
    torso.add(criarMembro(geoArmPart, geoArmJoint, matBody, -0.5, 0.4, 'leftUpperArm',  'leftLowerArm'));
    const rightArm = criarMembro(geoArmPart, geoArmJoint, matBody, 0.5, 0.4, 'rightUpperArm', 'rightLowerArm');
    torso.add(rightArm);

    // Espada no braço direito
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), matBlade);
    handle.position.set(0, -0.4, 0);
    joaoBones.rightLowerArm.add(handle);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.3), matBlade);
    blade.position.set(0, -0.6, 0.1);
    blade.rotation.z = Math.PI / 2;
    handle.add(blade);

    const geoLegPart  = new THREE.BoxGeometry(0.3, 0.6, 0.3);
    const geoLegJoint = new THREE.SphereGeometry(0.15);
    joaoBones.torso.add(criarMembro(geoLegPart, geoLegJoint, matBody, -0.3, -0.5, 'leftUpperLeg',  'leftLowerLeg'));
    joaoBones.torso.add(criarMembro(geoLegPart, geoLegJoint, matBody,  0.3, -0.5, 'rightUpperLeg', 'rightLowerLeg'));

    scene.add(joaoNinjaGroup);
}

// ============================================================
// ANIMAÇÃO DE ANDAR
// ============================================================
function atualizarAnimacaoAndar(tempo, estaAndando) {
    if (!joaoBones.root) return;
    if (estaAndando) {
        const a = tempo * 8;
        const s = Math.sin(a);
        joaoBones.torso.rotation.x = Math.sin(tempo * 2) * 0.1;
        joaoBones.leftUpperLeg.rotation.x  =  s * (Math.PI / 6);
        joaoBones.rightUpperLeg.rotation.x = -s * (Math.PI / 6);
        joaoBones.leftLowerLeg.rotation.x  = (s  > 0 ? s  : 0) * (Math.PI / 4);
        joaoBones.rightLowerLeg.rotation.x = (-s > 0 ? -s : 0) * (Math.PI / 4);
        joaoBones.leftUpperArm.rotation.x  = -s * (Math.PI / 4);
        joaoBones.rightUpperArm.rotation.x =  s * (Math.PI / 4);
        joaoBones.leftLowerArm.rotation.x  = -Math.PI / 3;
        joaoBones.rightLowerArm.rotation.x = -Math.PI / 3;
    } else {
        joaoBones.torso.rotation.x       = 0;
        joaoBones.leftUpperLeg.rotation.x  = 0;
        joaoBones.rightUpperLeg.rotation.x = 0;
        joaoBones.leftLowerLeg.rotation.x  = 0;
        joaoBones.rightLowerLeg.rotation.x = 0;
        joaoBones.leftUpperArm.rotation.x  = 0;
        joaoBones.rightUpperArm.rotation.x = 0;
        joaoBones.leftLowerArm.rotation.x  = 0;
        joaoBones.rightLowerArm.rotation.x = 0;
    }
}

// ============================================================
// LABEL "NINJA JOÃO"
// ============================================================
function criarNomeLabel() {
    nomeLabelElement = document.createElement('div');
    Object.assign(nomeLabelElement.style, {
        position: 'absolute', color: '#ffffff', padding: '3px 8px',
        background: 'rgba(0,0,0,0.6)', borderRadius: '4px',
        fontSize: '15px', fontFamily: 'sans-serif',
        pointerEvents: 'none', whiteSpace: 'nowrap',
        border: '1px solid #00ff00'
    });
    nomeLabelElement.textContent = 'Ninja João';
    document.body.appendChild(nomeLabelElement);
}

function atualizarNomeLabel() {
    if (!nomeLabelElement || !joaoNinjaGroup) return;
    const pos = joaoBones.head.getWorldPosition(new THREE.Vector3());
    pos.y += 0.5;
    const p = pos.clone().project(camera);
    nomeLabelElement.style.left = `${(p.x * 0.5 + 0.5) * window.innerWidth}px`;
    nomeLabelElement.style.top  = `${(-p.y * 0.5 + 0.5) * window.innerHeight}px`;
    nomeLabelElement.style.transform = 'translate(-50%,-100%)';
}

// ============================================================
// PORTAL DE SAÍDA
// ============================================================
function criarPortalSaida(x, z) {
    const group = new THREE.Group();

    const corBloqueado   = 0xdd2222;
    const matPortal = new THREE.MeshStandardMaterial({
        color: corBloqueado, emissive: corBloqueado, emissiveIntensity: 0.5,
        transparent: true, opacity: 0.85
    });

    // Disco base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.15, 24), matPortal.clone());
    base.position.y = 0.08;
    group.add(base);

    // Aro vertical
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.12, 8, 32), matPortal.clone());
    aro.position.y = 1.5;
    aro.rotation.x = Math.PI / 2;
    group.add(aro);

    // Coluna esquerda
    const colL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 0.2), matPortal.clone());
    colL.position.set(-0.85, 1.5, 0);
    group.add(colL);

    // Coluna direita
    const colR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 0.2), matPortal.clone());
    colR.position.set(0.85, 1.5, 0);
    group.add(colR);

    group.position.set(x, 0, z);
    scene.add(group);
    meshesDoCenario.push(group);
    return group;
}

function desbloquearPortal() {
    if (!saidaMesh) return;
    const corAberto = 0x00ffaa;
    saidaMesh.children.forEach(child => {
        if (child.material) {
            child.material.color.setHex(corAberto);
            child.material.emissive.setHex(corAberto);
            child.material.emissiveIntensity = 1.0;
        }
    });
    saidaMesh.userData.desbloqueado = true;
    saidaDesbloqueada = true;
    mostrarMensagem('✅ Saída desbloqueada!\nVá ao portal verde!', 2500);
}

// ============================================================
// GERENCIAMENTO DE NÍVEIS
// ============================================================
function limparNivel() {
    meshesDoCenario.forEach(m => scene.remove(m));
    meshesDoCenario.length = 0;
    objetosNoCenario.length = 0;
    saidaMesh = null;
    saidaDesbloqueada = false;
}

function carregarNivel(n) {
    limparNivel();
    mapaAtual = NIVEIS[n];
    objetosDerrubados = 0;
    totalObjetos = 0;

    mapaAtual.forEach((linha, r) => {
        linha.forEach((valor, c) => {
            const x = c * TAMANHO_CELULA;
            const z = r * TAMANHO_CELULA;

            if (valor === 1) {
                const p = new THREE.Mesh(geoParede, matParede);
                p.position.set(x, 1.75, z);
                p.castShadow = true;
                p.receiveShadow = true;
                scene.add(p);
                meshesDoCenario.push(p);

            } else if (valor === 3) {
                posInicialX = x;
                posInicialZ = z;

            } else if (valor === 2) {
                const obj = new THREE.Mesh(geoObjeto, matObjetoRegular.clone());
                obj.position.set(x, 1, z);
                obj.userData.tipo = 'regular';
                scene.add(obj);
                objetosNoCenario.push(obj);
                meshesDoCenario.push(obj);
                totalObjetos++;

            } else if (valor === 5) {
                const obj = new THREE.Mesh(geoObjeto, matObjetoGuia.clone());
                obj.position.set(x, 1, z);
                obj.userData.tipo = 'guia';
                scene.add(obj);
                objetosNoCenario.push(obj);
                meshesDoCenario.push(obj);
                totalObjetos++;

            } else if (valor === 4) {
                saidaPos.x = x;
                saidaPos.z = z;
                saidaMesh = criarPortalSaida(x, z);
            }
        });
    });

    if (joaoNinjaGroup) {
        joaoNinjaGroup.position.set(posInicialX, 0, posInicialZ);
        joaoNinjaGroup.rotation.y = 0;
    }

    tempoInicial = Date.now();
    atualizarHUD();
}

function proximoNivel() {
    if (jogoEncerrado) return;
    jogoEncerrado = true; // Bloqueia durante transição

    if (nivelAtual >= NIVEIS.length - 1) {
        mostrarMensagem('🎉 PARABÉNS, NINJA JOÃO!\nVocê completou todos os 10 níveis!\n\nObrigado por jogar!', 0, true);
    } else {
        const atual = nivelAtual + 1;
        mostrarMensagem(`⭐ Nível ${atual} Completo!\n\nPróximo nível em breve...`, 2500);
        setTimeout(() => {
            nivelAtual++;
            jogoEncerrado = false;
            carregarNivel(nivelAtual);
            esconderMensagem();
        }, 2500);
    }
}

// ============================================================
// HUD E MENSAGENS
// ============================================================
function atualizarHUD() {
    document.getElementById('nivel').innerText  = `${nivelAtual + 1}/10`;
    document.getElementById('score').innerText  = `${objetosDerrubados}/${totalObjetos}`;
}

const msgOverlay = document.getElementById('msg-overlay');

function mostrarMensagem(texto, duracao, final = false) {
    msgOverlay.textContent = texto;
    msgOverlay.classList.add('visible');
    if (duracao > 0 && !final) {
        setTimeout(esconderMensagem, duracao);
    }
}

function esconderMensagem() {
    msgOverlay.classList.remove('visible');
}

// ============================================================
// COLISÃO
// ============================================================
function podeMover(nx, nz) {
    const col = Math.round(nx / TAMANHO_CELULA);
    const row = Math.round(nz / TAMANHO_CELULA);
    if (!mapaAtual[row] || mapaAtual[row][col] === undefined) return false;
    const v = mapaAtual[row][col];
    if (v === 1) return false;               // Parede
    if (v === 4 && !saidaDesbloqueada) return false; // Saída bloqueada
    return true;
}

function verificarSaida() {
    if (!saidaDesbloqueada || !joaoNinjaGroup || jogoEncerrado) return;
    const dx = joaoNinjaGroup.position.x - saidaPos.x;
    const dz = joaoNinjaGroup.position.z - saidaPos.z;
    if (Math.sqrt(dx * dx + dz * dz) < 1.2) {
        proximoNivel();
    }
}

// ============================================================
// COMBATE
// ============================================================
function derrubarAlvo(alvo) {
    if (!alvo.visible) return;
    alvo.visible = false;
    objetosDerrubados++;
    atualizarHUD();

    if (objetosNoCenario.every(o => !o.visible)) {
        desbloquearPortal();
    }
}

function atacarEspada() {
    if (!joaoNinjaGroup) return;
    const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(joaoNinjaGroup.quaternion);
    const raycaster = new THREE.Raycaster(
        joaoNinjaGroup.position.clone().add(new THREE.Vector3(0, 1, 0)), dir
    );
    const visiveis = objetosNoCenario.filter(o => o.visible);
    const hits = raycaster.intersectObjects(visiveis);
    if (hits.length > 0 && hits[0].distance < 2.0) derrubarAlvo(hits[0].object);
}

function atacarShuriken() {
    if (!joaoNinjaGroup) return;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const visiveis = objetosNoCenario.filter(o => o.visible);
    const hits = raycaster.intersectObjects(visiveis);
    if (hits.length > 0 && hits[0].distance < 20) derrubarAlvo(hits[0].object);
}

// ============================================================
// CONTROLES
// ============================================================
function configurarMobile(id, tecla) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', e => { e.preventDefault(); TECLAS[tecla] = true; });
    btn.addEventListener('touchend',   e => { e.preventDefault(); TECLAS[tecla] = false; });
}

function atualizarControles(deltaTime) {
    if (!joaoNinjaGroup || jogoEncerrado) return;

    let girar = 0;
    if (TECLAS['KeyA'] || TECLAS['ArrowLeft'])  girar =  1.0;
    if (TECLAS['KeyD'] || TECLAS['ArrowRight']) girar = -1.0;
    if (girar !== 0) joaoNinjaGroup.rotation.y += girar * deltaTime * 3;

    const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(joaoNinjaGroup.quaternion).normalize();
    let dz = 0, estaAndando = false;
    if (TECLAS['KeyW'] || TECLAS['ArrowUp'])   { dz =  VELOCIDADE_NINJA;       estaAndando = true; }
    if (TECLAS['KeyS'] || TECLAS['ArrowDown']) { dz = -VELOCIDADE_NINJA * 0.5; estaAndando = true; }

    if (dz !== 0) {
        const nx = joaoNinjaGroup.position.x + dir.x * dz;
        const nz = joaoNinjaGroup.position.z + dir.z * dz;
        if (podeMover(nx, nz)) {
            joaoNinjaGroup.position.x = nx;
            joaoNinjaGroup.position.z = nz;
        }
    }

    const offset = new THREE.Vector3(0, 1.8, -TAMANHO_CELULA * 1.5);
    offset.applyQuaternion(joaoNinjaGroup.quaternion);
    camera.position.copy(joaoNinjaGroup.position).add(offset);
    camera.lookAt(joaoNinjaGroup.position.clone().add(new THREE.Vector3(0, 1, 0)));

    atualizarAnimacaoAndar(clock.getElapsedTime(), estaAndando);
}

// ============================================================
// LOOP PRINCIPAL
// ============================================================
function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();

    atualizarControles(dt);
    atualizarNomeLabel();
    verificarSaida();

    // Girar objetos visíveis
    const t = clock.getElapsedTime();
    objetosNoCenario.forEach(obj => {
        if (obj.visible) obj.rotation.y += 0.05;
    });

    // Pulsar portal desbloqueado
    if (saidaMesh && saidaDesbloqueada) {
        const pulse = Math.sin(t * 4) * 0.4 + 0.8;
        saidaMesh.children.forEach(child => {
            if (child.material) child.material.emissiveIntensity = pulse;
        });
        saidaMesh.rotation.y += 0.01;
    }

    // Timer HUD
    if (!jogoEncerrado) {
        const segs = Math.floor((Date.now() - tempoInicial) / 1000);
        document.getElementById('timer').innerText = segs + 's';
    }

    renderer.render(scene, camera);
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
window.addEventListener('keydown', e => {
    TECLAS[e.code] = true;
    if (e.code === 'Space') atacarEspada();
});
window.addEventListener('keyup',   e => { TECLAS[e.code] = false; });
window.addEventListener('mousedown', atacarShuriken);

setTimeout(() => {
    configurarMobile('btn-up',    'KeyW');
    configurarMobile('btn-down',  'KeyS');
    configurarMobile('btn-left',  'KeyA');
    configurarMobile('btn-right', 'KeyD');
    document.getElementById('btn-sword').addEventListener('touchstart',    e => { e.preventDefault(); atacarEspada(); });
    document.getElementById('btn-shuriken').addEventListener('touchstart', e => { e.preventDefault(); atacarShuriken(); });
}, 500);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

criarNinjaArticulado();
criarNomeLabel();
carregarNivel(0);
animate();


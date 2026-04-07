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

// Configurações Técnicas
const TAMANHO_CELULA = 2;
const VELOCIDADE = 0.12;
const TECLAS = {};
let score = 0;
let tempoInicial = Date.now();
const objetosNoCenario = [];
let totalObjetos = 0;

// 2. SETUP DA CENA 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505); 
scene.fog = new THREE.Fog(0x050505, 1, 25); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luzes
const light = new THREE.PointLight(0xffffff, 1.5, 50);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0x222222));

// 3. CONSTRUÇÃO DO MUNDO
const geoParede = new THREE.BoxGeometry(TAMANHO_CELULA, 4, TAMANHO_CELULA);
const matParede = new THREE.MeshStandardMaterial({ color: 0x333333 });
const geoObjeto = new THREE.OctahedronGeometry(0.5); 
const matObjeto = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x003300 });

MAPA.forEach((linha, r) => {
    linha.forEach((valor, c) => {
        const x = c * TAMANHO_CELULA;
        const z = r * TAMANHO_CELULA;

        if (valor === 1) {
            const parede = new THREE.Mesh(geoParede, matParede);
            parede.position.set(x, 2, z);
            parede.castShadow = true;
            parede.receiveShadow = true;
            scene.add(parede);
        } else if (valor === 2) {
            const obj = new THREE.Mesh(geoObjeto, matObjeto);
            obj.position.set(x, 1, z);
            scene.add(obj);
            objetosNoCenario.push(obj);
            totalObjetos++;
        } else if (valor === 3) {
            camera.position.set(x, 1.6, z);
        }
    });
});

const chao = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
scene.add(chao);

// 4. LÓGICA DE MOVIMENTAÇÃO E COLISÃO
window.addEventListener('keydown', (e) => TECLAS[e.code] = true);
window.addEventListener('keyup', (e) => TECLAS[e.code] = false);

function podeMover(novoX, novoZ) {
    const col = Math.round(novoX / TAMANHO_CELULA);
    const row = Math.round(novoZ / TAMANHO_CELULA);
    if (MAPA[row] && MAPA[row][col] !== undefined) {
        return MAPA[row][col] !== 1;
    }
    return false;
}

function atualizarControles() {
    let dx = 0; let dz = 0;
    if (TECLAS['ArrowUp'] || TECLAS['KeyW']) dz -= VELOCIDADE;
    if (TECLAS['ArrowDown'] || TECLAS['KeyS']) dz += VELOCIDADE;
    if (TECLAS['ArrowLeft'] || TECLAS['KeyA']) dx -= VELOCIDADE;
    if (TECLAS['ArrowRight'] || TECLAS['KeyD']) dx += VELOCIDADE;

    if (podeMover(camera.position.x + dx, camera.position.z)) camera.position.x += dx;
    if (podeMover(camera.position.x, camera.position.z + dz)) camera.position.z += dz;
    light.position.set(camera.position.x, 3, camera.position.z);
}

// 5. LÓGICA DE ATAQUE (DERRUBAR OBJETOS)
function atacar() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const atingidos = raycaster.intersectObjects(objetosNoCenario);

    if (atingidos.length > 0) {
        const alvo = atingidos[0].object;
        if (atingidos[0].distance < 3 && alvo.visible) {
            alvo.visible = false;
            score++;
            document.getElementById('score').innerText = score;
            if (score === totalObjetos) {
                alert("Parabéns João! Você limpou o labirinto!");
            }
        }
    }
}
window.addEventListener('mousedown', atacar);

// 6. LOOP DE ANIMAÇÃO
function animate() {
    requestAnimationFrame(animate);
    atualizarControles();
    objetosNoCenario.forEach(obj => { if (obj.visible) obj.rotation.y += 0.05; });
    const segundos = Math.floor((Date.now() - tempoInicial) / 1000);
    document.getElementById('timer').innerText = segundos + "s";
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

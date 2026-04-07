import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// 1. MAPA DO LABIRINTO
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

const TAMANHO_CELULA = 2;
const VELOCIDADE = 0.12;
const TECLAS = {};
let score = 0;
let tempoInicial = Date.now();
const objetosNoCenario = [];
let totalObjetos = 0;

let yaw = 0; 
let pitch = 0;

// 2. CONFIGURAÇÃO DA CENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const luzAmbiente = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(luzAmbiente);

const luzSol = new THREE.DirectionalLight(0xffffff, 1.0);
luzSol.position.set(5, 10, 5);
scene.add(luzSol);

// 3. CONSTRUÇÃO DO MUNDO
const geoParede = new THREE.BoxGeometry(TAMANHO_CELULA, 4, TAMANHO_CELULA);
const matParede = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const geoObjeto = new THREE.OctahedronGeometry(0.5); 
const matObjeto = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });

MAPA.forEach((linha, r) => {
    linha.forEach((valor, c) => {
        const x = c * TAMANHO_CELULA;
        const z = r * TAMANHO_CELULA;
        if (valor === 1) {
            const parede = new THREE.Mesh(geoParede, matParede);
            parede.position.set(x, 2, z);
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
    new THREE.MeshStandardMaterial({ color: 0x333333 })
);
chao.rotation.x = -Math.PI / 2;
scene.add(chao);

// 4. CONTROLES (PC e CELULAR)

// PC: Mouse para girar
window.addEventListener('mousedown', () => {
    if(!/Android|iPhone/i.test(navigator.userAgent)) document.body.requestPointerLock();
});

window.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        yaw -= e.movementX * 0.003;
        pitch -= e.movementY * 0.003;
        pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
        camera.rotation.set(pitch, yaw, 0);
    }
});

// CELULAR: Toque para girar
let touchX = null;
let touchY = null;
window.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    if (touchX !== null && touchY !== null) {
        const dx = e.touches[0].clientX - touchX;
        const dy = e.touches[0].clientY - touchY;
        yaw -= dx * 0.005;
        pitch -= dy * 0.005;
        pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
        camera.rotation.set(pitch, yaw, 0);
    }
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
}, { passive: false });

// 5. MOVIMENTAÇÃO (Teclado)
window.addEventListener('keydown', (e) => TECLAS[e.code] = true);
window.addEventListener('keyup', (e) => TECLAS[e.code] = false);

// Função para botões na tela (Celular)
window.configurarBotoes = (id, tecla) => {
    const btn = document.getElementById(id);
    if(btn) {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); TECLAS[tecla] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); TECLAS[tecla] = false; });
    }
};

function podeMover(nx, nz) {
    const col = Math.round(nx / TAMANHO_CELULA);
    const row = Math.round(nz / TAMANHO_CELULA);
    return MAPA[row] && MAPA[row][col] !== 1;
}

function atualizarControles() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0; dir.normalize();
    const lat = new THREE.Vector3().crossVectors(camera.up, dir).normalize();

    let dx = 0; let dz = 0;
    if (TECLAS['KeyW'] || TECLAS['ArrowUp']) { dx += dir.x * VELOCIDADE; dz += dir.z * VELOCIDADE; }
    if (TECLAS['KeyS'] || TECLAS['ArrowDown']) { dx -= dir.x * VELOCIDADE; dz -= dir.z * VELOCIDADE; }
    if (TECLAS['KeyA'] || TECLAS['ArrowLeft']) { dx += lat.x * VELOCIDADE; dz += lat.z * VELOCIDADE; }
    if (TECLAS['KeyD'] || TECLAS['ArrowRight']) { dx -= lat.x * VELOCIDADE; dz -= lat.z * VELOCIDADE; }

    if (podeMover(camera.position.x + dx, camera.position.z)) camera.position.x += dx;
    if (podeMover(camera.position.x, camera.position.z + dz)) camera.position.z += dz;
}

// 6. LOOP FINAL
function animate() {
    requestAnimationFrame(animate);
    atualizarControles();
    objetosNoCenario.forEach(obj => { if (obj.visible) obj.rotation.y += 0.05; });
    const segs = Math.floor((Date.now() - tempoInicial) / 1000);
    document.getElementById('timer').innerText = segs + "s";
    renderer.render(scene, camera);
}

// Inicializar botões se existirem
setTimeout(() => {
    ['btn-up', 'btn-down', 'btn-left', 'btn-right'].forEach(id => {
        const t = id === 'btn-up' ? 'KeyW' : id === 'btn-down' ? 'KeyS' : id === 'btn-left' ? 'KeyA' : 'KeyD';
        window.configurarBotoes(id, t);
    });
}, 500);

animate();

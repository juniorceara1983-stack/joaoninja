import * as THREE from 'three';

// 1. A MATRIZ DO LABIRINTO (Seu "Mapa")
// 1 = Parede, 0 = Caminho, 2 = Objeto (Alvo), 3 = João (Início), 4 = Saída
const MAPA = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1, 0, 0, 2, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 2, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 2, 1],
    [1, 0, 0, 0, 2, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Configurações Básicas
const TAMANHO_CELULA = 2;
let score = 0;
let tempoInicial = Date.now();

// 2. CONFIGURAÇÃO DA CENA 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a); // Fundo escuro ninja

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Sombras para melhor realidade
document.body.appendChild(renderer.domElement);

// 3. ILUMINAÇÃO (Realidade Melhorada)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040)); // Luz suave de preenchimento

// 4. CONSTRUÇÃO DO LABIRINTO VIA MATRIZ
const geoParede = new THREE.BoxGeometry(TAMANHO_CELULA, 3, TAMANHO_CELULA);
const matParede = new THREE.MeshStandardMaterial({ color: 0x444444 });

const geoObjeto = new THREE.SphereGeometry(0.5, 16, 16);
const matObjeto = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x330000 });

MAPA.forEach((linha, r) => {
    linha.forEach((valor, c) => {
        const x = c * TAMANHO_CELULA;
        const z = r * TAMANHO_CELULA;

        if (valor === 1) { // Parede
            const parede = new THREE.Mesh(geoParede, matParede);
            parede.position.set(x, 1.5, z);
            parede.receiveShadow = true;
            parede.castShadow = true;
            scene.add(parede);
        } 
        else if (valor === 2) { // Objeto para derrubar
            const obj = new THREE.Mesh(geoObjeto, matObjeto);
            obj.position.set(x, 0.8, z);
            obj.name = "alvo";
            scene.add(obj);
        }
        else if (valor === 3) { // Posição Inicial do João
            camera.position.set(x, 1.6, z);
        }
    });
});

// 5. CHÃO
const geoChao = new THREE.PlaneGeometry(100, 100);
const matChao = new THREE.MeshStandardMaterial({ color: 0x111111 });
const chao = new THREE.Mesh(geoChao, matChao);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
scene.add(chao);

// 6. LOOP DE ANIMAÇÃO E ATUALIZAÇÃO
function animate() {
    requestAnimationFrame(animate);
    
    // Atualiza o Cronômetro na tela
    const segundos = Math.floor((Date.now() - tempoInicial) / 1000);
    document.getElementById('timer').innerText = segundos + "s";

    renderer.render(scene, camera);
}

// Ajuste de tela caso o usuário vire o celular
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

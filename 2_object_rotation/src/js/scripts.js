import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const starsTexture = 'stars.3affcd84.jpg';
const sunTexture = 'sun.e71f5951.jpg';
const mercuryTexture = 'mercury.2873ac83.jpg';
const venusTexture = 'venus.041dbae7.jpg';
const earthTexture = 'earth.7b6c6755.jpg';
const marsTexture = 'mars.515bc00c.jpg';
const jupiterTexture = 'jupiter.20a915af.jpg';
const saturnTexture = 'saturn.61180e1d.jpg';
const saturnRingTexture = 'saturn ring.0c2c4b1e.png';
const uranusTexture = 'uranus.1d67e5ed.jpg';
const uranusRingTexture = 'uranus ring.bc601d49.png';
const neptuneTexture = 'neptune.e11cd9d1.jpg';
const plutoTexture = 'pluto.8da297c7.jpg';

//! WebGLRenderer, sahneyi çizecek motor.
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

//! OrbitControls, kamera etrafında fareyle dönmeyi ve yakınlaşmayı sağlar.
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

//! Ambiyans ışık ekler. Sahnedeki tüm objelere eşit miktarda yumuşak ışık ekler, karanlık bölgeleri biraz aydınlatır.
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//! Küresel bir uzay efekti sağlar.
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

//! Güneş
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

//! Tek tek tüm gezegenleri oluşturmak zaman alacağı için, fonk yazıldı
function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);


    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32
        );
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }



    scene.add(obj);
    mesh.position.x = position;
    return { mesh , obj}
}


//! Merkür
// const mercuryGeo = new THREE.SphereGeometry(3.2, 30, 30);
// const mercuryMat = new THREE.MeshStandardMaterial({
//     map: textureLoader.load(mercuryTexture)
// });
// const mercury = new THREE.Mesh(mercuryGeo, mercuryMat);
// // sun.add(mercury); //* Sahneye değil, güneşe ekliyoruz. Merkürü güneşe eklediğimiz için otomatik güneş etrafında dönüyor, ama bu da farklı bir sorun yapıyor o da gezegenler güneşle aynı hızda dönmüyor, ama eğer güneşe eklersek cisimler aynı hızda dönüyor.

// const mercuryObj = new THREE.Object3D();
// mercuryObj.add(mercury);
// scene.add(mercuryObj);

// mercury.position.x = 28;

const mercury = createPlanete(3.2, mercuryTexture, 28);

//! Saturn
// const saturnGeo = new THREE.SphereGeometry(10, 30, 30);
// const saturnMat = new THREE.MeshStandardMaterial({
//     map: textureLoader.load(saturnTexture)
// });
// const saturn = new THREE.Mesh(saturnGeo, saturnMat);
// const saturnObj = new THREE.Object3D();
// saturnObj.add(saturn);
// scene.add(saturnObj);
// saturn.position.x = 138;
const saturn = createPlanete(10, saturnTexture, 138, {
    innerRadius: 10, 
    outerRadius: 20,
    texture: saturnRingTexture
});

//! Saturn Ring
// const saturnRingGeo = new THREE.RingGeometry(10, 20, 32);
// const saturnRingMat = new THREE.MeshBasicMaterial({
//     map: textureLoader.load(saturnRingTexture),
//     side: THREE.DoubleSide
// });
// const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
// saturnObj.add(saturnRing);
// saturnRing.position.x = 138;
// saturnRing.rotation.x = -0.5 * Math.PI; //* Ring'in duruşunu düzeltme

//! Venüs
const venus = createPlanete(5.8, venusTexture, 44);

//! Dünya
const earth = createPlanete(6, earthTexture, 62);

//! Mars
const mars = createPlanete(4, marsTexture, 78);

//! Jüpiter
const jupiter = createPlanete(12, jupiterTexture, 100);

//! Neptun
const neptun = createPlanete(7, neptuneTexture, 200);

//! Pluto
const pluto = createPlanete(2.8, plutoTexture, 216);

//! Uranüs
const uranus = createPlanete(7, uranusTexture, 176, {
    innerRadius: 7, 
    outerRadius: 12,
    texture: uranusRingTexture
});

//! Işık ekle
const pointLight = new THREE.PointLight(0xFFFFFF, 30000, 300);
scene.add(pointLight);



function animate() {

    //! Kendi etrafında dönme
     //Self-rotation
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptun.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);

    //Around-sun-rotation
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptun.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//! Tarayıcı pencere boyutu değiştiğinde, sahnenin ve kameranın oranları da otomatik güncellenir.
window.addEventListener('resize', function() {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});
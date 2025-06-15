import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// import stars from 'stars.jpg';
// import nebula from 'nebula.jpg';

const monkeyUrl = new URL('../../dist/monkey.glb' , import.meta.url);


//! WebGLRenderer(), three.js kütüphanesinde sahneleri tarayıcıda WebGL teknolojisiyle çizmeye yarayan render motorudur. Yani bu yapı olmadan cisimleri oluştursan bile ekranda gösteremezsin.
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

//* Renderer'ın boyutunu ayarlıyoruz 
renderer.setSize(window.innerWidth, window.innerHeight);

//* Renderer'ı html'in body etiketine ekliyoruz.
document.body.appendChild(renderer.domElement);

//! Sahne oluşturuyoruz
const scene = new THREE.Scene();

//! Perspective Kamera eklenmesi
const camera = new THREE.PerspectiveCamera(
    75, //* fov (field of view) görüş açısı, genellikle 75 kullanılır.
    window.innerWidth / window.innerHeight, //* aspect, ekranın derinlik-yükseklik oranı
    0.1, //* near, kameranın görebileceği en yakın nokta
    1000 //* far, kameranın görebileceği en uzak nokta
);


//! Orbit Control: fare ile kameranın açısını değiştirme, yakınlaştırma, uzaklaştırma sağlar. OrbitControls'ün import edilmesi lazım. Bunun sonrasında orbit.update() kodu mutlaka yazılmalı. Yani kısaca eksenin hareket etmesini sağlar.
const orbit = new OrbitControls(camera, renderer.domElement);


//! Coordinat düzlemini ekrana ekleme, parametre verilmek zorunda değil, o her bir eksenin uzunmlığu
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper); //* sahneye ekle

//camera.position.z = 5; //* Kamera pozisyonunu değiştir
//camera.position.y = 2; //* Kamera pozisyonunu değiştir.

camera.position.set(-10, 30, 30); //* Kamera pozisyonunu değiştir. (x, y, z)

//* orbit update edilmeli
orbit.update();


//! Kutu Ekleme
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00}); //* MeshBasicMaterial, renginin görünmesi için ışığa ihtiyaç yoktur.
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

//! Plane Ekleme
const planeGeometry = new THREE.PlaneGeometry(30, 30);
// const planeMaterial = new THREE.MeshBasicMaterial({
//     color: 0xFFFFFF,
//     side: THREE.DoubleSide //* normalde tek tarafı görünüyor, eğer bunu da yaparsak iki taraftan da görünebiliyor.
// });
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide 
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI; //* Grid ile plane i üst üste getirmek için döndürdük.

plane.receiveShadow = true;

//! Grid Helper Ekleme: normalde girdin nasıl görünmesi gerektiğine göre referans çizer. Eğer boyutunu ayarlamak istiyorsak parametre girebiliriz.
const gridHelper = new THREE.GridHelper(30); //* (boyut, kare sayısı) parametrelerini alabilir.
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50); //* (Radius of the sphere, number of width of segment of wireframe, number of height of segment of wireframe)
// const sphereMaterial = new THREE.MeshBasicMaterial({
//      color: 0x0000FF,
//      //wireframe: true, //* Kafes görüntüsü
// });
const sphereMaterial = new THREE.MeshStandardMaterial({
     color: 0x0000FF,
     //wireframe: true, //* Kafes görüntüsü
});
// const sphereMaterial = new THREE.MeshLambertMaterial({
//     color: 0x0000FF,
//     wireframe: false,
// });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

//! Ambians ışık ekleme
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//! Directional light ekleme
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

//! Directional Light Helper ekleme
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5); //* ikinci paramtre karenin boyutu, zorunlu değil
// scene.add(dLightHelper);

//! Gölgenin yarım çıkmasını engelle
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);


//! Spot Işığı ekleme
const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
// spotLight.intensity = 100000; //* Spot ışık yeteri ökadar aydınlatmadığında daha fazla aydınlatması için default 1 gelir.
spotLight.castShadow = true; //* sadece bu şekilde gölge oluşturursak, spot ışıkta pixel pixel bir gölge oluşuyor. Bu da ışığın açısı ile alakalı, o yüzden angle ı değiştirmemiz gerekiyor.
spotLight.angle = 0.2;


const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//! Sis ekleme, uzaklaştıkça görünürlüğün azalması
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);  //* (renk, yakın mesafe, uzak mesafe)
scene.fog = new THREE.FogExp2 (0xFFFFFF, 0.01);

//! Uzayın arka planının reng,ni değiştirme
// renderer.setClearColor(0xFFEA00);

const stars = 'stars.jpg';
const nebula = 'nebula.jpg';

const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load('stars.jpg');
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
    // color: 0x00FF00, 
    // map: textureLoader.load(nebula), //* cisme resim ekleme
});

//! materyalin farklı kısımlarına farklı resimler ekleme
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
]
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);
box2.material.map = textureLoader.load(nebula);


//! Plane oluşturup düğümleri hareket ettirme

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);
//* xyz xyz xyz xyz .... => bu şekilde ilerliyor array
plane2.geometry.attributes.position.array[0] -= 10 * Math.random(); //* x ilki
plane2.geometry.attributes.position.array[1] -= 10 * Math.random(); //* y ilki
plane2.geometry.attributes.position.array[2] -= 10 * Math.random(); //* z ilki


//* sonuncunun z si
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random(); //* z



const sphere2Geometry = new THREE.SphereGeometry(4);

//* her noktanın yerini tanımlar
const vShader = `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

//* Rgb formatında rengi değiştiriyor
const fShader = `
    void main() {
        gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
    }
`;


const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);


//! 3D Model Yükleme
const assetLoader = new GLTFLoader();
assetLoader.load(monkeyUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);
}, undefined, function(error) {
    console.error(error);
});




//! Arayüzde bir kontrol paneli oluşturur. Anlık olarak parametreleri değiştirebilmek için kullanılır. 
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

//* Renk değiştirme
gui.addColor(options, 'sphereColor').onChange(function(e) {
    sphere.material.color.set(e)
});

//* True false değiştirme, checkbox
gui.add(options, 'wireframe').onChange(function(e) {
    sphere.material.wireframe = e
});

//* Range eklemek: min ve max değerleri de parametre olarak ekliyoruz.
gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);


// box.rotation.x = 5;
// box.rotation.y = 5;

let step = 0;
// let speed = 0.01;


//! Mouse Hareketleri
const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = 'theBox';


//* istersek animate fonksiyonunu parametresiz kullabiliriz istersek de parametreli, öğrenğin zamana bağlı olabilir.
function animate(time) {

    //! Kutuyu yana döndürme (duruşunu değiştirme)
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed; //* gui ye onChnage eklemeden bu şekilde de çağrılabilir.
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra; //* Penumbra, spot ışığının bitiş noktalarının bulanıklığı ayarlar.
    spotLight.intensity = options.intensity* 100000;
    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    if(intersects.length != 0)
    console.log(intersects);

    for(let i = 0; i < intersects.length; i++) {
        console.log(intersects[i].object.id)
        if (intersects[i].object.id === sphereId) 
            intersects[i].object.material.color.set(0xFF0000);

        if (intersects[i].object.name === 'theBox') {
            intersects[i].object.rotation.x = time / 1000;
            intersects[i].object.rotation.y = time / 1000;
        }
            
    }

    //! plane'in ilk ve son düüğümünü hareket ettirme
    plane2.geometry.attributes.position.array[0] = 10 * Math.random(); 
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random(); 
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;

    //* Render etmek, bu sahneyi bu kameraya göre çiz demek.
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//! Sayfa ilk başta hangi boyutta açılırsa sadece o kadar boyutta kalıyordu, büyültüp küçültsende ekran değişmiyordu, bunun için resize yaptık.
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})


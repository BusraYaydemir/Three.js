import * as THREE from 'three';


//! WebGLRenderer(), three.js kütüphanesinde sahneleri tarayıcıda WebGL teknolojisiyle çizmeye yarayan render motorudur. Yani bu yapı olmadan cisimleri oluştursan bile ekranda gösteremezsin.
const renderer = new THREE.WebGLRenderer();

//* Renderer'ın boyutunu ayarlıyoruz 
renderer.setSize(window.innerWidth, window.innerHeight);

//* Renderer'ı html'in body etiketine ekliyoruz.
document.body.appendChild(renderer.domElement);
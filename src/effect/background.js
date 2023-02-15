/*
 * @Descripttion:天空盒子
 * @Author: peiqf
 * @Date: 2023-02-09 16:21:01
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-13 11:24:21
 */
import * as THREE from 'three'

export class Background {
  constructor(scene) {
    this.scene = scene
    this.url = '/src/assets/black-bg.png'
    
    this.init()
  }
  // 创建天空盒子
  init() {
    // 创建一个纹理加载器
    const loader = new THREE.TextureLoader()
    const geometry = new THREE.SphereGeometry(5000, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: loader.load(this.url),
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.copy({
      x: 0,
      y: 0,
      z: 0,
    })
    this.scene.add(sphere)
  }
}

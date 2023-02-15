/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2023-02-14 09:57:55
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-14 10:34:01
 */
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
export class Font {
  constructor(scene) {
    this.scene = scene
    this.font = null
    this.init()
  }
  init() {
    const loader = new FontLoader()
    loader.load('/font.json', font => {
      this.font = font
      // 创建字体几何体
      this.createTextQueue()
    })
  }
  createTextQueue() {
    [
      {
        text: '最高的楼',
        size: 20,
        position: {
          x: -10,
          y: 130,
          z: 410,
        },
        rotate: Math.PI / 1.3,
      },
      {
        text: '第二高的楼',
        size: 20,
        position: {
          x: 167,
          y: 110,
          z: -38,
        },
        rotate: Math.PI / 2.2,
      },
    ].forEach(item => {
      this.createText(item)
    })
  }
  createText(data) {
    const geometry = new TextGeometry(data.text, {
      font: this.font,
      size: 20,
      height: 2,
    })
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        void main(){
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        }
      `,
      fragmentShader: `
        void main(){
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

        }
      `,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(data.position)
    mesh.rotateY(data.rotate)
    this.scene.add(mesh)
  } 
}

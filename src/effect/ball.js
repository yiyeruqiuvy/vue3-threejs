/*
 * @Descripttion: 球体的扩散
 * @Author: peiqf
 * @Date: 2023-02-13 16:19:35
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-13 16:37:26
 */

import * as THREE from 'three'
import { color } from '../config/index'
export class Ball {
  constructor(scene, time) {
    this.scene = scene
    this.time = time
    this.createSphere({
      color: color.ballColor,
      height: 60,
      opacity: 0.6,
      speed: 4.0,
      position: { x: 300, y: 0, z: -200 },
    })
  }
  createSphere(options) {
    const geometry = new THREE.SphereGeometry(50, 32, 32, Math.PI / 2, Math.PI * 2, 0, Math.PI * 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color),
        },
        u_height: {
          value: options.height,
        },
        u_opacity: { value: options.opacity },
        u_time: this.time,
        u_speed: {
          value: options.speed,
        }, //扩散速度
      },
      transparent: true,
      side: THREE.DoubleSide, //显示被建筑物遮挡的一半
      // depthTest: false, //被建筑物遮挡
      vertexShader: `
        uniform float u_time;
        uniform float u_height;
        uniform float u_speed;

        varying float v_opacity;
        void main(){
          v_opacity = mix(1.0, 0.0, position.y / u_height);//透明度
          vec3 v_position =  position * mod(u_time / u_speed, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position,1.0);

        }
      `,
      fragmentShader: `
      // precision mediump float;
      varying float v_opacity;
      uniform vec3 u_color;
      uniform float u_opacity;
      void main(){
        gl_FragColor = vec4(u_color, u_opacity * v_opacity);
      }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(options.position)
    this.scene.add(mesh)
  }
}

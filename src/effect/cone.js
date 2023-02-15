/*
 * @Descripttion: 上下抖动发光的四棱锥 ，指示图标，
 * @Author: peiqf
 * @Date: 2023-02-13 16:36:03
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-13 17:19:24
 */

import * as THREE from 'three'
import { color } from '../config/index'
export class Cone {
  constructor(scene, top, height) {
    this.scene = scene
    this.top = top
    this.height = height
    this.createCone({
      color: color.coneColor,
      height: 60,
      position: { x: 0, y: 50, z: 0 },
    })
  }
  createCone(options) {
    const geometry = new THREE.ConeGeometry(15, 30, 4)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color),
        },
        u_height: this.height,
        u_top: this.top, //扩散速度
      },
      transparent: true,
      side: THREE.DoubleSide, //显示被建筑物遮挡的一半
      depthTest: false, //被建筑物遮挡
      vertexShader: `
        uniform float u_top;
        uniform float u_height;

        void main(){
          float f_angle = u_height / 10.0;
          float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
          float new_y = position.y;
          float new_z = position.z * cos(f_angle) + position.x * sin(f_angle);
          vec4 v_position = vec4(new_x, new_y + u_top, new_z, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * v_position;

        }
      `,
      fragmentShader: `
      uniform vec3 u_color;
      uniform float u_opacity;
      void main(){
        gl_FragColor = vec4(u_color,  0.6);
      }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(options.position)
    mesh.rotateZ(Math.PI)
    this.scene.add(mesh)
  }
}

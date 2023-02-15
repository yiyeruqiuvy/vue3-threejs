/*
 * @Descripttion:透明的圆柱体光墙
 * @Author: peiqf
 * @Date: 2023-02-13 10:45:59
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-13 16:17:45
 */
import * as THREE from 'three'
import { color } from '../config/index'
import { Cylinder } from './cylinder'
export class Wall {
  constructor(scene, time) {
    this.scene = scene
    this.time = time
    this.color = color.wallColor
    // 圆柱配置
    this.config = {
      radius: 50,
      height: 50,
      open: true,
      color: color.wallColor,
      opacity: 0.6,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      speed: 2.0,
    }
    this.cereateWall()
  }
  cereateWall() {
    new Cylinder(this.scene, this.time).createCylinder(this.config)
  }
}

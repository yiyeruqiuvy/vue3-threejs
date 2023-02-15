/*
 * @Descripttion: 蓝色的扩散圆
 * @Author: peiqf
 * @Date: 2023-02-13 11:38:35
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-13 16:15:07
 */
import { Cylinder } from './cylinder'
import { color } from '../config'
export class Circle {
  constructor(scene, time) {
    this.configer = {
      radius: 50,
      color: color.circleColor,
      opacity: 0.6,
      height: 1,
      open: false,
      position: {
        x: 300,
        y: 0,
        z: 300,
      },
      speed: 1.0,
    }
    new Cylinder(scene, time).createCylinder(this.configer)
  }
}

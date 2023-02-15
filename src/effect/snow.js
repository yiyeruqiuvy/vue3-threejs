/*
 * @Descripttion: 雪花效果
 * @Author: peiqf
 * @Date: 2023-02-14 10:34:29
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-14 13:49:34
 */
import { Points } from './points'
// import
export class Snow {
  constructor(scene) {
    this.points = new Points(scene, {
      size: 30,
      opacity: 0.8,
      range: 1000,
      count: 600,
      setPosition: position => {
        position.speedX = Math.random() - 0.5
        position.speedY = Math.random() + 0.4
        position.speedZ = Math.random() - 0.5
      },
      setAnimation: position => {
        position.x -= position.speedX
        position.y -= position.speedY
        position.z -= position.speedZ
      },
      url: '../../src/assets/snow.png',
    })
  }
  animation() {
    this.points.animation()
  }
}

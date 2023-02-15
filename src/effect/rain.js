/*
 * @Descripttion: 雨水的效果
 * @Author: peiqf
 * @Date: 2023-02-14 11:12:41
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-14 13:49:13
 */
import { Points } from './points'

export class Rain {
  constructor(scene) {
    this.points = new Points(scene, {
      size: 10,
      opacity: 0.4,
      range: 1000,
      count: 800,
      setPosition: position => {
        position.speedY = Math.random() + 0.4
      },
      setAnimation: position => {
        position.y -= position.speedY
      },
      url: '../../src/assets/rain.png',
    })
  }

  animation() {
    this.points.animation()
  }
}

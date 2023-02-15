/*
 * @Descripttion: 封装的下落的物体类，如雪花，雨水
 * @Author: peiqf
 * @Date: 2023-02-14 10:34:29
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-14 13:50:33
 */
import * as THREE from 'three'
// import
export class Points {
  constructor(scene, { size, opacity, range, count, setPosition, setAnimation, url }) {
    this.scene = scene
    // 范围
    this.range = range
    // 雪花的个数
    this.count = count
    this.material = null
    this.geometry = null
    this.setPosition = setPosition
    this.setAnimation = setAnimation
    this.url = url
    this.size = size
    this.opacity = opacity
    this.pointList = []
    this.init()
  }
  init() {
    // 粒子和粒子系统
    // pointCloud   Points
    // 材质
    this.material = new THREE.PointsMaterial({
      size: this.size,
      map: new THREE.TextureLoader().load(this.url),
      transparent: true,
      opacity: this.opacity,
      depthTest: false, //消除loader的黑色背景
    })
    // 几何对象
    this.geometry = new THREE.BufferGeometry()

    // 添加顶点信息
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2
      )
      this.setPosition(position)
      this.pointList.push(position)
    }
    this.geometry.setFromPoints(this.pointList)
    this.point = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.point)
  }
  animation() {
    this.pointList.forEach(position => {
      this.setAnimation(position)
      this.geometry.setFromPoints(this.pointList)
      if (position.y <= 0) {
        position.y = this.range / 2
      }
    })
  }
}

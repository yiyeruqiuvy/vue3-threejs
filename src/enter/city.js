/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2023-02-09 14:23:41
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-15 15:03:38
 */
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { loadFBX } from '../utils'
import { SurroundLine } from '../effect/surroundLine'
import { Smoke } from '../effect/somke'
import { Background } from '../effect/background'
import { Radar } from '../effect/radar'
import { Wall } from '../effect/wall'
import { Circle } from '../effect/circle'
import { Ball } from '../effect/ball'
import { Cone } from '../effect/cone'
import { Fly } from '../effect/fly'
import { Road } from '../effect/road'
import { Font } from '../effect/font'
import { Snow } from '../effect/snow'
import { Rain } from '../effect/rain'
export class City {
  constructor(scene, camera, controls) {
    this.scene = scene
    this.camera = camera
    this.controls = controls
    this.tweenPositon = null
    this.tweenRotation = null
    // 建筑物扫描的高度
    this.height = {
      value: 5,
    }
    // 建筑物扫描变化的值
    this.time = {
      value: 0,
    }
    this.loadCity()
    this.top = {
      value: 0,
    }
    this.flag = false
    this.effect = {}
  }
  loadCity() {
    // console.log(this.scene)
    // 加载模型，渲染到画布上
    loadFBX('/src/model/beijing.fbx').then(object => {
      this.scene.add(object)
      object.traverse(child => {
        if (child.isMesh) {
          new SurroundLine(this.scene, child, this.height, this.time)
        }
      })
      this.initEffect()
    })
  }
  // 效果
  initEffect() {
    new Background(this.scene)
    new Radar(this.scene, this.time)
    new Wall(this.scene, this.time)
    new Circle(this.scene, this.time)
    new Ball(this.scene, this.time)
    new Cone(this.scene, this.top, this.height)
    new Fly(this.scene, this.time)
    new Road(this.scene, this.time)
    new Font(this.scene)

    this.effect = new Snow(this.scene)
    // this.effect = new Rain(this.scene)
    this.effect1 = new Smoke(this.scene)
    // 添加点击事件
    this.addClick()
    // 添加鼠标滚轮事件
    this.addWheel()
  }
  addClick() {
    // 解决点击聚焦和鼠标控件的冲突
    let flag = true
    document.onmousedown = () => {
      flag = true
      document.onmousemove = () => {
        flag = false
      }
    }
    document.onmouseup = event => {
      if (flag) {
        this.clickEvent(event)
      }
      document.onmousemove = null
    }
  }
  // 让场景跟随鼠标的坐标进行缩放

  addWheel() {
    const body = document.body
    body.onmousewheel = event => {
      const value = 30
      // 鼠标当前的坐标信息
      let x = (event.clientX / window.innerWidth) * 2 - 1
      let y = -(event.clientY / window.innerHeight) * 2 + 1
      const vector = new THREE.Vector3(x, y, 0.5)
      vector.unproject(this.camera)
      vector.sub(this.camera.position).normalize()
      if (event.wheelDelta > 0) {
        this.camera.position.x += vector.x * value
        this.camera.position.y += vector.y * value
        this.camera.position.z += vector.z * value

        this.controls.target.x += vector.x * value
        this.controls.target.y += vector.y * value
        this.controls.target.z += vector.z * value
      } else {
        this.camera.position.x -= vector.x * value
        this.camera.position.y -= vector.y * value
        this.camera.position.z -= vector.z * value

        this.controls.target.x -= vector.x * value
        this.controls.target.y -= vector.y * value
        this.controls.target.z -= vector.z * value
      }
    }
  }
  clickEvent(event) {
    // 添加点击事件

    // 获取到浏览器坐标
    let x = (event.clientX / window.innerWidth) * 2 - 1
    let y = -(event.clientY / window.innerHeight) * 2 + 1
    // 创建三维设备坐标
    let standardVector = new THREE.Vector3(x, y, 0.5)
    // 转换为世界坐标
    let wordVector = standardVector.unproject(this.camera)
    // console.log(wordVector);

    // 做序列化
    let ray = wordVector.sub(this.camera.position).normalize()
    // 如何实现点击选中
    // 创建一个涉嫌发射器，用来发射一条射线
    let raycaster = new THREE.Raycaster(this.camera.position, ray)
    // 返回射线碰撞到的物体
    let intersects = raycaster.intersectObjects(this.scene.children, true)
    // console.log(intersects)
    let point3d = null
    if (intersects.length) {
      point3d = intersects[0]
    }
    console.log(point3d.point)
    if (point3d) {
      // console.log(point3d.object.name)
      // 开始动画修改观察点
      const time = 1000
      const proportion = 3
      this.tweenPositon = new TWEEN.Tween(this.camera.position)
        .to(
          {
            x: point3d.point.x * proportion,
            y: point3d.point.y * proportion,
            z: point3d.point.z * proportion,
          },
          time
        )
        .start()
      console.log(this.camera.rotation)
      this.tweenRotation = new TWEEN.Tween(this.camera.rotation)
        .to(
          {
            x: this.camera.rotation.x,
            y: this.camera.rotation.y,
            z: this.camera.rotation.z,
          },
          time
        )
        .start()
    }
  }
  start(delta) {
    // 雪花下落
    for (const key in this.effect) {
      this.effect1.animation()
      this.effect[key] && this.effect[key].animation()
    }

    if (this.tweenPositon && this.tweenRotation) {
      this.tweenPositon.update()
      this.tweenRotation.update()
    }
    this.time.value += delta
    // 高度变化上下
    this.height.value += 0.4
    if (this.height.value > 160) {
      this.height.value = 5
    }
    // 圆锥起伏高度

    if (this.top.value > 15 || this.top.value < 0) {
      this.flag = !this.flag
    }
    this.top.value += this.flag ? -0.8 : 0.8
  }
}

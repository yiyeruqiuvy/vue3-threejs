/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2023-02-09 13:49:54
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-14 14:10:48
 */
import '../base/index.css'
import * as THREE from 'three'
import { City } from './city.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const initCity = () => {
  // 获取canvas元素
  const canvas = document.getElementById('webgl')
  // 创建场景
  const scene = new THREE.Scene()
  // 创建相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000)
  camera.position.set(1000, 500, 100)
  scene.add(camera)

  // 添加相机轨道控件
  const controls = new OrbitControls(camera, canvas)
  // 设置属性
  controls.enableDamping = true // 是否有惯性
  controls.enableZoom = false // 是否支持缩放
  controls.minDistance = 100 //最近距离
  controls.maxDistance = 2000 //最远距离
  // 开启右键拖动
  controls.enablePan = true

  // 添加灯光
  scene.add(new THREE.AmbientLight(0xadadad))
  const directionLigtht = new THREE.DirectionalLight(0xffffff)
  directionLigtht.position.set(0, 0, 0)
  scene.add(directionLigtht)

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置像素比，让渲染器使用和浏览器当前一样的像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 添加场景颜色
  renderer.setClearColor(new THREE.Color(0x000000), 1)
  const city = new City(scene, camera, controls)
  const clock = new THREE.Clock()
  // 创建动画
  const start = () => {
    city.start(clock.getDelta())
    controls.update()
    // 渲染
    renderer.render(scene, camera)
    requestAnimationFrame(start)
  }
  start()

  // 监听浏览器
  window.addEventListener('resize', () => {
    // 更新相机的投影矩阵
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置像素比，让渲染器使用和浏览器当前一样的像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

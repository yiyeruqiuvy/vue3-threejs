/*
 * @Descripttion: 模型环境
 * @Author: peiqf
 * @Date: 2023-02-09 16:09:30
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-15 11:00:08
 */
import * as THREE from 'three'
import { color } from '../config/index'
export class SurroundLine {
  constructor(scene, child, height, time) {
    this.scene = scene
    this.child = child //模型
    // 需要一个模型颜色，最底部显示的颜色
    this.meshColor = color.mesh
    // 需要一个头部颜色，最顶部显示的颜色
    this.headColor = color.head
    // 扫描高度
    this.height = height
    // 不断变化的时间
    this.time = time
    //  初始化
    this.createMesh()
    // 创建外围线条
    this.createLine()
  }
  computedMesh() {
    this.child.geometry.computeBoundingBox()
    this.child.geometry.computeBoundingSphere()
  }
  // 建筑物渲染及从小到上扫描线条
  createMesh() {
    this.computedMesh()
    const { max, min } = this.child.geometry.boundingBox
    // 高度差
    const hightDifference = max.z - min.z

    const material = new THREE.ShaderMaterial({
      uniforms: {
        // 当前扫描的高度
        u_height: this.height,
        // 扫描线条的颜色是什么
        u_up_color: {
          value: new THREE.Color(color.rasingColor),
        },
        u_city_color: {
          value: new THREE.Color(this.meshColor),
        },
        u_head_color: {
          value: new THREE.Color(this.headColor),
        },
        // 建筑物高度
        u_hightDifference: {
          value: hightDifference,
        },
        u_time: this.time,
      },
      vertexShader: `
              uniform float u_time;
              varying vec3 v_position;
              
              void main(){
                // 变化的最大时间
                float uMax = 4.0;
                v_position = position;
                // 变化的比例
                float rate = u_time / uMax * 2.0;
                // 边界条件
                if(rate > 1.0 ){
                  rate = 1.0;
                }
                float z = position.z * rate;
                // position.z += u_time;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(vec2(position), z, 1.0);
              }
            `,
      fragmentShader: `
              varying vec3 v_position;
              uniform vec3 u_city_color;
              uniform vec3 u_head_color;
              uniform float u_hightDifference;
              uniform vec3 u_up_color;
              uniform float u_height;
              void main(){
                vec3 base_color = u_city_color;
                base_color = mix(base_color,u_head_color,v_position.z/u_hightDifference);
                // 上升线条的高度是多少,即线条的宽度
                if(u_height > v_position.z  && u_height < v_position.z+6.0){
                  float f_index = (u_height-v_position.z)/3.0;
                  base_color = mix(u_up_color,base_color,abs(f_index - 1.0));
                }
                
                gl_FragColor = vec4(base_color,1.0); 
              }
            `,
    })
    const mesh = new THREE.Mesh(this.child.geometry, material)
    // 让mesh继承child的旋转，缩放，平移
    mesh.position.copy(this.child.position)
    mesh.rotation.copy(this.child.rotation)
    mesh.scale.copy(this.child.scale)
    this.scene.add(mesh)
  }
  // 自定义线条
  createLine() {
    // 获取建筑物的外围
    const geometry = new THREE.EdgesGeometry(this.child.geometry)
    // api创建线条渲染
    // const material = new THREE.LineBasicMaterial({ color: color.soundLine })
    // 扫描的位置
    const { max, min } = this.child.geometry.boundingBox
    // 自定义创建线条渲染
    const material = new THREE.ShaderMaterial({
      uniforms: {
        line_color: {
          value: new THREE.Color(color.soundLine),
        },
        // 一个不断变化的值 u_height,u_time
        u_time: this.time,
        // 扫描的位置
        u_max: {
          value: max,
        },
        u_min: {
          value: min,
        },
        // 扫光的颜色
        live_color: {
          value: new THREE.Color(color.liveColor),
        },
      },
      vertexShader: `
        uniform float u_time;
        uniform vec3 live_color;
        uniform vec3 line_color;
        uniform vec3 u_max;
        uniform vec3 u_min;
        varying vec3 v_color;
        void main(){
          float uMax = 4.0;
          float rate = u_time / uMax * 2.0;
          if(rate > 1.0 ){
            rate = 1.0;
            }
          float z = position.z * rate;
          float new_time = mod(u_time * 0.1, 1.0); //0.1为光带移动的速度
          // 扫描的位置
          float rangeY = mix(u_min.y, u_max.y, new_time);
          // 在当前这个区间内，显示扫描光带
          if(rangeY < position.y && rangeY > position.y - 200.0){
            float f_index = 1.0 - sin((position.y - rangeY) / 200.0 * 3.14);
            float r = mix(live_color.r, line_color.r, f_index);
            float g = mix(live_color.g, line_color.g, f_index);
            float b = mix(live_color.b, line_color.b, f_index);
            
            v_color = vec3(r,g,b);
          } else {
            v_color = line_color;
          }
         
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vec2(position), z, 1.0);

        }
      `,
      fragmentShader: `
        varying vec3 v_color;
        void main(){
          gl_FragColor = vec4(v_color,1.0);
        }
      `,
    })
    // 创建线条
    const line = new THREE.LineSegments(geometry, material)
    // 继承建筑物的偏移量和旋转
    line.scale.copy(this.child.scale)
    line.position.copy(this.child.position)
    line.rotation.copy(this.child.rotation)
    // 添加
    this.scene.add(line)
  }
}

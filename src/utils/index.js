/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2023-02-09 14:27:25
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-09 14:45:29
 */
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
const fbxLoader = new FBXLoader()
export const loadFBX = url => {
  return new Promise((resolve, reject) => {
    fbxLoader.load(
      url,
      object => {
        resolve(object)
      },
      () => {},
      error => {
        reject(error)
      }
    )
  })
}

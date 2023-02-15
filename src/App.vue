<!--
 * @Descripttion: 
 * @Author: peiqf
 * @Date: 2023-02-09 13:43:59
 * @LastEditors: peiqf
 * @LastEditTime: 2023-02-09 14:50:49
-->
<script setup>
import { onMounted } from 'vue';
import { initCity } from './enter/index'

onMounted(() => {
  // 初始化三维场景
   initCity()
})
</script>

<template>
 <canvas id="webgl">浏览器不支持canvas，请更换浏览器</canvas>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  fontSize: number
  color: string
  fontFamily: string
  fontStyle?: string
  letterSpacing: number
}

const props = defineProps<Props>()
</script>

<template>
  <div class="title" :style="{color:props.color, fontSize:props.fontSize+'px', 
    fontFamily:props.fontFamily, fontStyle:props.fontStyle, letterSpacing:props.letterSpacing+'px'}">
    DevScope
  </div>
</template>

<style scoped>
.title{
  width: 100%;
  height: 100%;
  
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
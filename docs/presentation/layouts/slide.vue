<script setup lang="ts">
defineProps<{ eyebrow?: string }>()
</script>

<template>
  <div class="slidev-layout fa-slide">
    <div v-if="eyebrow" class="fa-eyebrow">{{ eyebrow }}</div>
    <slot />
    <div class="fa-footer">
      <span><b>Finance AI</b> · Universidad de Cundinamarca</span>
      <span><SlideCurrentNo /></span>
    </div>
  </div>
</template>

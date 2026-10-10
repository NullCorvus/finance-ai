<script setup lang="ts">
// Captura de pantalla real de la app. Coloca el archivo en public/screens/<name>.png
// y aparecerá aquí; mientras no exista se muestra un marcador de posición.
import { computed, ref } from 'vue'

const props = defineProps<{
  name: string
  label?: string
  ratio?: string // p. ej. "9 / 16" (móvil) o "16 / 10" (escritorio)
  width?: string
  wide?: boolean
}>()

const failed = ref(false)
const src = computed(() => `${import.meta.env.BASE_URL}screens/${props.name}.png`)
</script>

<template>
  <figure class="fa-shot" :style="{ width: width ?? '100%' }">
    <div class="fa-shot-frame" :class="{ wide }" :style="{ aspectRatio: ratio ?? '9 / 16' }">
      <img v-if="!failed" :src="src" :alt="label ?? name" @error="failed = true" />
      <div v-else class="fa-shot-ph">
        <Icon name="image" :size="28" />
        <span>Captura pendiente</span>
        <code>screens/{{ name }}.png</code>
      </div>
    </div>
    <figcaption v-if="label">{{ label }}</figcaption>
  </figure>
</template>

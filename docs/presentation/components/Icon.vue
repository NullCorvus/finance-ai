<script setup lang="ts">
import { computed } from 'vue'
import lucide from '@iconify-json/lucide/icons.json'

const props = defineProps<{ name: string; size?: number | string }>()

const body = computed(() => {
  const set = lucide as any
  const direct = set.icons[props.name]
  if (direct) return direct.body as string
  const alias = set.aliases?.[props.name]?.parent
  return alias && set.icons[alias] ? (set.icons[alias].body as string) : ''
})
</script>

<template>
  <svg
    class="fa-icon"
    viewBox="0 0 24 24"
    :width="size ?? 22"
    :height="size ?? 22"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="body"
  />
</template>

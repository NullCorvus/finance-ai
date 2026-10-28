<script setup lang="ts">
defineProps<{ large?: boolean }>()

// Mantener este destino sincronizado con public/app-download-qr.jpg.
const downloadUrl = 'https://drive.google.com/file/d/1z__jJblXcb8MC2PZvE1tJzy3Kkh2GFgs/view?usp=drivesdk'
const qrSrc = `${import.meta.env.BASE_URL}app-download-qr.jpg`
</script>

<template>
  <figure class="fa-download-qr" :class="{ 'is-large': large }">
    <a :href="downloadUrl" target="_blank" rel="noopener noreferrer" aria-label="Descargar Finance AI">
      <img :src="qrSrc" alt="Código QR para descargar Finance AI" />
    </a>
    <figcaption>
      <a :href="downloadUrl" target="_blank" rel="noopener noreferrer">Descarga la app<span v-if="large">Escanea el código QR</span></a>
    </figcaption>
  </figure>
</template>

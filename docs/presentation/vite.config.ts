import { defineConfig } from 'vite'

// Slidev 53 + Vite 8: el minificador de CSS (lightningcss) rechaza un selector de los
// estilos internos de Slidev al compilar para producción. Desactivarlo solo afecta
// `npm run build` (el modo dev y la exportación a PDF no minifican).
export default defineConfig({
  build: { cssMinify: false },
})

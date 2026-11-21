<script setup>
// Modal reutilizable. Se usa para:
//  - tipo "confirmar": pregunta antes de eliminar (botones Cancelar / Eliminar)
//  - tipo "exito": avisa que se registró o editó un producto (botón Aceptar)
// Props: visible, tipo, titulo, mensaje. Emits: confirmar, cerrar.
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  tipo: { type: String, default: 'exito' }, // 'exito' | 'confirmar'
  titulo: { type: String, default: '' },
  mensaje: { type: String, default: '' }
})
const emit = defineEmits(['confirmar', 'cerrar'])

// Cerrar con la tecla Escape
function teclaPresionada(e) {
  if (e.key === 'Escape') emit('cerrar')
}
watch(() => props.visible, (abierto) => {
  if (abierto) window.addEventListener('keydown', teclaPresionada)
  else window.removeEventListener('keydown', teclaPresionada)
})
onBeforeUnmount(() => window.removeEventListener('keydown', teclaPresionada))
</script>

<template>
  <Transition name="modal">
    <!-- Clic en el fondo oscuro = cerrar -->
    <div v-if="visible" class="modal-fondo" @click.self="emit('cerrar')">
      <div class="modal-caja" role="dialog" aria-modal="true">
        <div class="modal-icono" :class="tipo">
          <span v-if="tipo === 'confirmar'">!</span>
          <span v-else>✓</span>
        </div>
        <h3>{{ titulo }}</h3>
        <p>{{ mensaje }}</p>

        <div class="modal-botones">
          <template v-if="tipo === 'confirmar'">
            <button class="btn" @click="emit('cerrar')">Cancelar</button>
            <button class="btn eliminar" @click="emit('confirmar')">Sí, eliminar</button>
          </template>
          <button v-else class="btn primario" @click="emit('cerrar')">Aceptar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

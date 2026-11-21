<script setup>
// Panel de resumen. Todos los datos se calculan con computed,
// así se actualizan solos cuando cambia la lista de productos.
import { computed } from 'vue'
import { formatoMoneda } from '../constants.js'

const props = defineProps({
  productos: { type: Array, required: true }
})

const totalProductos = computed(() => props.productos.length)

const valorTotal = computed(() =>
  props.productos.reduce((suma, p) => suma + p.precio * p.cantidad, 0)
)

// Producto con mayor precio (null si la lista está vacía)
const productoMasCaro = computed(() => {
  if (props.productos.length === 0) return null
  return props.productos.reduce((mayor, p) => (p.precio > mayor.precio ? p : mayor))
})
</script>

<template>
  <section class="resumen">
    <div class="dato">
      <span class="titulo">Total de productos</span>
      <span class="valor">{{ totalProductos }}</span>
    </div>
    <div class="dato">
      <span class="titulo">Valor total del inventario</span>
      <span class="valor">{{ formatoMoneda(valorTotal) }}</span>
    </div>
    <div class="dato">
      <span class="titulo">Producto con mayor precio</span>
      <span v-if="productoMasCaro" class="valor">
        {{ productoMasCaro.nombre }}
        <small>{{ formatoMoneda(productoMasCaro.precio) }}</small>
      </span>
      <span v-else class="valor sin-dato">—</span>
    </div>
  </section>
</template>

<script setup>
// Tabla de productos. Solo MUESTRA datos (los recibe por props)
// y avisa al padre con emits cuando se pulsa Editar o Eliminar.
import { formatoMoneda } from '../constants.js'

defineProps({
  productos: { type: Array, required: true },
  idEnEdicion: { type: Number, default: null },
  hayRegistrados: { type: Boolean, default: false }
})
const emit = defineEmits(['editar', 'eliminar'])
</script>

<template>
  <!-- v-if: mensaje cuando no hay nada que mostrar -->
  <p v-if="productos.length === 0" class="vacio">
    {{ hayRegistrados ? 'Ningún producto coincide con el filtro.' : 'Aún no hay productos registrados.' }}
  </p>

  <div v-else class="tabla-scroll">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th class="num">Precio</th>
          <th class="num">Cantidad</th>
          <th class="num">Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <!-- v-for: una fila por producto -->
        <tr v-for="p in productos" :key="p.id" :class="{ 'fila-editando': p.id === idEnEdicion }">
          <td>{{ p.nombre }}</td>
          <td><span class="etiqueta">{{ p.categoria }}</span></td>
          <td class="num">{{ formatoMoneda(p.precio) }}</td>
          <td class="num">{{ p.cantidad }}</td>
          <td class="num"><strong>{{ formatoMoneda(p.precio * p.cantidad) }}</strong></td>
          <td class="botones">
            <button class="btn pequeno" @click="emit('editar', p)">Editar</button>
            <button class="btn pequeno peligro" @click="emit('eliminar', p)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

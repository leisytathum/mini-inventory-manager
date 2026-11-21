<script setup>
// Filtros: buscador por nombre y select de categoría.
// Usa el patrón v-model en componentes: recibe props y emite "update:<prop>".
import { CATEGORIAS } from '../constants.js'

defineProps({
  busqueda: { type: String, default: '' },
  categoria: { type: String, default: '' }
})
const emit = defineEmits(['update:busqueda', 'update:categoria'])
</script>

<template>
  <div class="filtros">
    <input
      type="search"
      placeholder="Buscar por nombre..."
      :value="busqueda"
      @input="emit('update:busqueda', $event.target.value)"
    />
    <select :value="categoria" @change="emit('update:categoria', $event.target.value)">
      <option value="">Todas las categorías</option>
      <option v-for="cat in CATEGORIAS" :key="cat" :value="cat">{{ cat }}</option>
    </select>
  </div>
</template>

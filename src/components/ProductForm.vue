<script setup>
// Formulario para registrar o editar un producto.
// Props: productoEditar (null = modo registro).
// Emits: guardar(producto), cancelar().
import { reactive, watch, computed } from 'vue'
import { CATEGORIAS } from '../constants.js'

const props = defineProps({
  productoEditar: { type: Object, default: null }
})
const emit = defineEmits(['guardar', 'cancelar'])

const vacio = () => ({ id: null, nombre: '', categoria: '', precio: '', cantidad: '' })

const form = reactive(vacio())
const errores = reactive({})

const modoEdicion = computed(() => props.productoEditar !== null)

// Cuando el padre manda un producto para editar, se copian sus datos al formulario
watch(() => props.productoEditar, (producto) => {
  limpiarErrores()
  Object.assign(form, producto ? { ...producto } : vacio())
})

function limpiarErrores() {
  Object.keys(errores).forEach((k) => delete errores[k])
}

// Validaciones: todo obligatorio, precio y cantidad > 0
function validar() {
  limpiarErrores()
  if (!form.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!form.categoria) errores.categoria = 'Selecciona una categoría.'

  if (form.precio === '' || form.precio === null) errores.precio = 'El precio es obligatorio.'
  else if (Number(form.precio) <= 0) errores.precio = 'El precio debe ser mayor a 0.'

  if (form.cantidad === '' || form.cantidad === null) errores.cantidad = 'La cantidad es obligatoria.'
  else if (Number(form.cantidad) <= 0) errores.cantidad = 'La cantidad debe ser mayor a 0.'
  else if (!Number.isInteger(Number(form.cantidad))) errores.cantidad = 'La cantidad debe ser un número entero.'

  return Object.keys(errores).length === 0
}

function enviar() {
  if (!validar()) return

  emit('guardar', {
    id: form.id,
    nombre: form.nombre.trim(),
    categoria: form.categoria,
    precio: Number(form.precio),
    cantidad: Number(form.cantidad)
  })

  // El aviso de éxito lo muestra App con el modal
  if (!modoEdicion.value) Object.assign(form, vacio())
}

function cancelar() {
  limpiarErrores()
  Object.assign(form, vacio())
  emit('cancelar')
}
</script>

<template>
  <section class="tarjeta formulario" :class="{ editando: modoEdicion }">
    <h2>{{ modoEdicion ? 'Editar producto' : 'Registrar producto' }}</h2>

    <form novalidate @submit.prevent="enviar">
      <label>
        Nombre del producto
        <input v-model="form.nombre" type="text" placeholder="Ej. Laptop" :class="{ invalido: errores.nombre }" />
      </label>
      <p v-if="errores.nombre" class="error">{{ errores.nombre }}</p>

      <label>
        Categoría
        <select v-model="form.categoria" :class="{ invalido: errores.categoria }">
          <option value="" disabled>-- Selecciona --</option>
          <option v-for="cat in CATEGORIAS" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </label>
      <p v-if="errores.categoria" class="error">{{ errores.categoria }}</p>

      <label>
        Precio
        <input v-model="form.precio" type="number" step="0.01" placeholder="0.00" :class="{ invalido: errores.precio }" />
      </label>
      <p v-if="errores.precio" class="error">{{ errores.precio }}</p>

      <label>
        Cantidad en stock
        <input v-model="form.cantidad" type="number" step="1" placeholder="0" :class="{ invalido: errores.cantidad }" />
      </label>
      <p v-if="errores.cantidad" class="error">{{ errores.cantidad }}</p>

      <div class="acciones">
        <button type="submit" class="btn primario">
          {{ modoEdicion ? 'Guardar cambios' : 'Registrar' }}
        </button>
        <button v-if="modoEdicion" type="button" class="btn" @click="cancelar">Cancelar</button>
      </div>
    </form>
  </section>
</template>

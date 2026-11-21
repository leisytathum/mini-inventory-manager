<script setup>
// Componente principal: guarda el ESTADO de la app (lista de productos y filtros)
// y se lo pasa a los hijos con props. Los hijos avisan cambios con emits.
import { ref, reactive, computed, watch } from 'vue'
import ProductForm from './components/ProductForm.vue'
import ProductFilters from './components/ProductFilters.vue'
import ProductTable from './components/ProductTable.vue'
import SummaryPanel from './components/SummaryPanel.vue'
import AppModal from './components/AppModal.vue'

const CLAVE_STORAGE = 'mini-inventory-productos'

// Carga los productos guardados en el navegador (si hay)
function cargarProductos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || []
  } catch {
    return []
  }
}

// ---- Estado reactivo ----
const productos = ref(cargarProductos())
const busqueda = ref('')          // texto del buscador
const categoriaFiltro = ref('')   // '' = todas las categorías
const productoEnEdicion = ref(null)
// Estado del modal (un solo modal que cambia de contenido)
const modal = reactive({ visible: false, tipo: 'exito', titulo: '', mensaje: '' })
const productoAEliminar = ref(null)

function abrirModal(tipo, titulo, mensaje) {
  Object.assign(modal, { visible: true, tipo, titulo, mensaje })
}

let siguienteId = productos.value.reduce((max, p) => Math.max(max, p.id), 0) + 1

// Guarda en localStorage cada vez que cambia la lista (para no perderla al recargar)
watch(productos, (lista) => {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista))
}, { deep: true })

// Pasa a minúsculas y quita tildes, así "lampara" encuentra "Lámpara"
const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// ---- Computed: filtro en tiempo real ----
const productosFiltrados = computed(() => {
  const texto = normalizar(busqueda.value.trim())
  return productos.value.filter((p) => {
    const coincideNombre = normalizar(p.nombre).includes(texto)
    const coincideCategoria = !categoriaFiltro.value || p.categoria === categoriaFiltro.value
    return coincideNombre && coincideCategoria
  })
})

// ---- Métodos ----
// Recibe el producto desde el formulario (emit "guardar")
function guardarProducto(datos) {
  if (datos.id) {
    // Editar: reemplaza el producto que tiene ese id
    const i = productos.value.findIndex((p) => p.id === datos.id)
    if (i !== -1) productos.value[i] = { ...datos }
    productoEnEdicion.value = null
    abrirModal('exito', 'Producto actualizado', `Los cambios de "${datos.nombre}" se guardaron correctamente.`)
  } else {
    // Nuevo: le asigna un id único
    productos.value.push({ ...datos, id: siguienteId++ })
    abrirModal('exito', 'Producto registrado', `"${datos.nombre}" se agregó al inventario.`)
  }
}

function editarProducto(producto) {
  productoEnEdicion.value = { ...producto }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelarEdicion() {
  productoEnEdicion.value = null
}

// Paso 1: al pulsar Eliminar se abre el modal de confirmación
function eliminarProducto(producto) {
  productoAEliminar.value = producto
  abrirModal('confirmar', '¿Eliminar producto?', `Se eliminará "${producto.nombre}" del inventario. Esta acción no se puede deshacer.`)
}

// Paso 2: si el usuario confirma en el modal, se elimina
function confirmarEliminacion() {
  const producto = productoAEliminar.value
  productos.value = productos.value.filter((p) => p.id !== producto.id)
  // Si justo se estaba editando ese producto, se cancela la edición
  if (productoEnEdicion.value?.id === producto.id) productoEnEdicion.value = null
  productoAEliminar.value = null
  modal.visible = false
}

function cerrarModal() {
  modal.visible = false
  productoAEliminar.value = null
}
</script>

<template>
  <header class="encabezado">
    <h1>Mini Inventory Manager</h1>
  </header>

  <main class="contenedor">
    <!-- Panel de resumen (siempre con TODOS los productos registrados) -->
    <SummaryPanel :productos="productos" />

    <div class="columnas">
      <!-- Formulario: recibe el producto a editar y emite guardar/cancelar -->
      <ProductForm
        :producto-editar="productoEnEdicion"
        @guardar="guardarProducto"
        @cancelar="cancelarEdicion"
      />

      <section class="tarjeta listado">
        <h2>Listado de productos</h2>
        <!-- Filtros con v-model en un componente (props + emits update:...) -->
        <ProductFilters
          v-model:busqueda="busqueda"
          v-model:categoria="categoriaFiltro"
        />
        <p class="contador">
          Mostrando {{ productosFiltrados.length }} de {{ productos.length }} productos
        </p>
        <ProductTable
          :productos="productosFiltrados"
          :id-en-edicion="productoEnEdicion?.id ?? null"
          :hay-registrados="productos.length > 0"
          @editar="editarProducto"
          @eliminar="eliminarProducto"
        />
      </section>
    </div>
  </main>

  <!-- Modal para confirmar eliminación y avisar registro/edición -->
  <AppModal
    :visible="modal.visible"
    :tipo="modal.tipo"
    :titulo="modal.titulo"
    :mensaje="modal.mensaje"
    @confirmar="confirmarEliminacion"
    @cerrar="cerrarModal"
  />
</template>

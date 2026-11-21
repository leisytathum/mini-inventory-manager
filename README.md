# Mini Inventory Manager (Vue.js)

Aplicación web hecha con **Vue 3 + Vite** para gestionar un inventario básico de productos:
registrar, listar, filtrar, editar, eliminar y ver un resumen del inventario.

## Cómo correrlo

Necesitas **Node.js 18 o superior**.

```bash
npm install
npm run dev
```

Abre en el navegador la dirección que aparece (normalmente http://localhost:5173).

Otros comandos: `npm run build` (genera la versión final en `dist/`) y `npm run preview` (la sirve).

## Estructura

```
mini-inventory-manager/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js                    # Monta la app
    ├── App.vue                    # Estado principal, filtro (computed) y métodos
    ├── constants.js               # Categorías y formato de dinero
    ├── style.css                  # Estilos
    └── components/
        ├── ProductForm.vue        # Formulario de registro/edición + validaciones
        ├── ProductFilters.vue     # Buscador y filtro por categoría
        ├── ProductTable.vue       # Tabla con subtotal y botones Editar/Eliminar
        ├── SummaryPanel.vue       # Total, valor del inventario y producto más caro
        └── AppModal.vue           # Modal para confirmar eliminación y avisar registro/edición
```

## Cómo se cumple cada requisito

| Requisito | Dónde y cómo |
|---|---|
| **Componentes** | 5 componentes hijos dentro de `App.vue`. |
| **Props** | `App` pasa `productos`, `productoEditar`, `idEnEdicion`, etc. a los hijos. |
| **Emits** | `ProductForm` emite `guardar` y `cancelar`; `ProductTable` emite `editar` y `eliminar`; `ProductFilters` emite `update:busqueda` y `update:categoria`; `AppModal` emite `confirmar` y `cerrar`. |
| **v-model** | En todos los campos del formulario y en los filtros (`v-model:busqueda`, `v-model:categoria` sobre el componente). |
| **v-for** | Filas de la tabla y opciones de los `select`. |
| **v-if / v-else** | Mensajes de error, tabla vacía, botón Cancelar solo al editar, producto más caro cuando no hay productos. |
| **Métodos** | `guardarProducto`, `editarProducto`, `eliminarProducto`, `cancelarEdicion` (App) y `validar`, `enviar` (formulario). |
| **Computed** | `productosFiltrados` (filtro en tiempo real) y `totalProductos`, `valorTotal`, `productoMasCaro` (resumen). |
| **Estado reactivo** | `ref` y `reactive`; al cambiar la lista, la tabla y el resumen se actualizan solos. |
| **Validaciones** | Todos los campos obligatorios; precio > 0; cantidad > 0 (y entera). Mensaje en rojo bajo cada campo. |

## Decisiones

- **El resumen usa todos los productos registrados**, no solo los filtrados, porque el enunciado habla de "productos registrados" y "valor total del inventario".
- **La búsqueda no distingue mayúsculas ni tildes** ("lampara" encuentra "Lámpara").
- **La cantidad debe ser un número entero** (no tiene sentido tener 2.5 unidades en stock).
- **Eliminar pide confirmación en un modal** para evitar borrar por error. Al registrar o editar también sale un modal de éxito. El modal se cierra con Aceptar/Cancelar, con Escape o haciendo clic fuera.
- **Extra:** los productos se guardan en el `localStorage` del navegador, así no se pierden al recargar la página.

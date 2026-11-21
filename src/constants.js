// Categorías permitidas (se usan en el formulario y en el filtro)
export const CATEGORIAS = ['Tecnología', 'Hogar', 'Oficina', 'Otros']

// Formatea un número con separador de miles y 2 decimales: 1500 -> "1,500.00"
export function formatoMoneda(valor) {
  return Number(valor).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

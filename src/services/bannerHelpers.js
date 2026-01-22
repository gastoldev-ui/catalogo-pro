/**
 * Asegura que el banner siempre tenga 5 slots definidos.
 * Transforma datos viejos o inicializa banners nuevos.
 */
export const prepararDatosBanner = (info) => {
  // 1. Crear la estructura base: un array de 5 slots vacíos
  const slotsBase = Array(5).fill(null).map(() => ({
    activo: false,
    texto: '',
    color: '#1a5fb4'
  }));

  // Caso A: No hay información previa (Banner virgen)
  if (!info) {
    return slotsBase;
  }

  // Caso B: Es el formato nuevo (Array de 5 slots)
  if (Array.isArray(info) && info.length === 5) {
    return [...info];
  }

  // Caso C: Es el formato antiguo (Un solo objeto con texto y color)
  // Lo migramos activando solo el primer slot o expandiéndolo según prefieras.
  // Aquí lo activamos en el slot 0 (izquierda) y mantenemos el resto vacío.
  if (!Array.isArray(info) && info.texto) {
    slotsBase[0] = {
      activo: true,
      texto: info.texto.toUpperCase(),
      color: info.color || '#1a5fb4'
    };
    return slotsBase;
  }

  // Caso D: Cualquier otro formato extraño o array de longitud distinta
  return slotsBase;
};

/**
 * Función útil para validar si un banner tiene al menos un bloque con texto
 */
export const tieneContenidoActivo = (bloques) => {
  if (!Array.isArray(bloques)) return false;
  return bloques.some(b => b.activo && b.texto.trim() !== "");
};
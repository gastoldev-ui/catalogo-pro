/**
 * bannerHelpers.js
 * Gestiona la transición de datos para el sistema de banners multi-bloque con rango.
 */

export const prepararDatosBanner = (info) => {
  // Caso 1: No hay datos (Banner nuevo)
  // Devolvemos un array con un bloque por defecto que ocupa todo el ancho (1 a 5)
  if (!info) {
    return [
      { 
        texto: '', 
        color: '#1a5fb4', 
        desde: 1, 
        hasta: 5 
      }
    ];
  }

  // Caso 2: Ya es el formato nuevo (un Array de bloques)
  if (Array.isArray(info)) {
    // Si el array está vacío, devolvemos el bloque por defecto
    if (info.length === 0) {
      return [{ texto: '', color: '#1a5fb4', desde: 1, hasta: 5 }];
    }
    // Si tiene datos, devolvemos una copia limpia
    return [...info];
  }

  // Caso 3: Formato de objeto único (la versión de "un solo bloque")
  // Lo convertimos a un Array de un solo elemento para que el modal no falle
  if (typeof info === 'object' && info.texto !== undefined) {
    return [
      {
        texto: info.texto || '',
        color: info.color || '#1a5fb4',
        desde: info.desde || 1,
        hasta: info.hasta || 5
      }
    ];
  }

  // Caso 4: Cualquier otro formato desconocido
  return [{ texto: '', color: '#1a5fb4', desde: 1, hasta: 5 }];
};

/**
 * Valida si un banner tiene al menos un bloque con texto para decidir si mostrarlo o no.
 */
export const tieneContenidoVisible = (bloques) => {
  if (!Array.isArray(bloques)) return false;
  return bloques.some(b => b.texto && b.texto.trim() !== "");
};
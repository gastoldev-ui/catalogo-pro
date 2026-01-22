import React from 'react';
import '../styles/banner.css';

const Banner = ({ id, datos, abrirEditor }) => {
  // Verificamos si hay datos activos en el array de 5 slots
  const tieneContenido = Array.isArray(datos) && datos.some(slot => slot.activo);

  // Si no hay datos o es un banner vacío, mostramos el placeholder para edición
  if (!tieneContenido) {
    return (
      <div 
        className="banner-grid-container empty no-print" 
        onClick={() => abrirEditor(id, datos, 'banner')}
      >
        <div className="banner-placeholder">
          + CLIC PARA CONFIGURAR BLOQUES / CATEGORÍAS
        </div>
      </div>
    );
  }

  return (
    <div 
      className="banner-grid-container" 
      onClick={() => abrirEditor(id, datos, 'banner')}
    >
      {datos.map((slot, idx) => (
        <div 
          key={idx}
          className={`banner-block ${slot.activo ? 'activo' : 'inactivo'}`}
          style={{ 
            // Cada bloque ocupa exactamente 1 de las 5 columnas
            gridColumn: 'span 1', 
            backgroundColor: slot.activo ? (slot.color || '#1a5fb4') : 'transparent',
            // Si no está activo, el borde derecho se oculta para no ensuciar el diseño
            borderRight: (slot.activo && idx < 4) ? '0.5pt solid rgba(255,255,255,0.3)' : 'none'
          }}
        >
          {slot.activo ? (
            <span className="banner-text">{slot.texto}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Banner;
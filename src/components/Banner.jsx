import React from 'react';
import '../styles/banner.css'; // Asegúrate de tener este archivo o incluir los estilos

const Banner = ({ id, datos, abrirEditor, columnasTotales }) => {
  
  // 1. Si no hay datos cargados, mostramos el botón de configuración (solo pantalla)
  if (!datos || !datos.celdas || datos.celdas.length === 0) {
    return (
      <div 
        className="banner-fila-vacia no-print" 
        onClick={() => abrirEditor(id, datos || { celdas: [] }, 'banner')}
        title="Configurar fila de banners"
      >
        <span className="plus-icon">+</span> Configurar Fila de Banners (Espacio de {columnasTotales} celdas)
      </div>
    );
  }

  // 2. Renderizado de la fila con Grid dinámico
  return (
    <div 
      className="fila-banner-maestra" 
      style={{ 
        display: 'grid', 
        /* Usamos la misma cantidad de columnas que los productos para alinear */
        gridTemplateColumns: `repeat(${columnasTotales}, 1fr)`,
        gap: '0', // Sin gap para que las imágenes se peguen si el usuario quiere
      }}
    >
      {datos.celdas.map((celda, idx) => (
        <div 
          key={celda.id || idx}
          className="celda-banner-item"
          onClick={() => abrirEditor(id, datos, 'banner')}
          style={{ 
            /* Esta es la clave: el span define cuánto espacio ocupa */
            gridColumn: `span ${celda.ancho || 1}`,
            backgroundColor: celda.tipo === 'texto' ? (celda.colorFondo || '#f4f4f4') : 'transparent',
            border: '0.1pt solid rgba(0,0,0,0.05)' // Borde casi invisible para guiar
          }}
        >
          {celda.tipo === 'imagen' ? (
            <div className="banner-img-wrapper">
              {celda.contenido ? (
                <img src={celda.contenido} alt="Banner" className="banner-img-render" />
              ) : (
                <span className="no-img-text no-print">Sin imagen</span>
              )}
            </div>
          ) : (
            <div className="banner-text-wrapper" style={{ color: celda.colorTexto || '#333' }}>
              {celda.contenido || "Texto del banner"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Banner;
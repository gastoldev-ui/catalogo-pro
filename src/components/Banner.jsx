import React from 'react';
import '../styles/banner.css';

// Cambiamos columnasTotales por columnas para que coincida con la prop enviada
const Banner = ({ id, datos, abrirEditor, columnas }) => {
  
  // 1. Si no hay datos, botón de configuración
  if (!datos || !datos.celdas || datos.celdas.length === 0) {
    return (
      <div 
        className="banner-fila-vacia no-print" 
        onClick={() => abrirEditor(id, datos || { celdas: [] }, 'banner')}
      >
        <span style={{ fontSize: '18px', marginRight: '8px', fontWeight: 'bold' }}>+</span> 
        Configurar Fila de Banners ({columnas} columnas)
      </div>
    );
  }

  // 2. Renderizado de la fila
  return (
    <div 
      className="fila-banner-maestra" 
      style={{ 
        // Usamos columnas (que viene de la prop)
        gridTemplateColumns: `repeat(${columnas}, 1fr)`,
        gap: '0px',
        height: '10mm' // Forzamos una altura base para que no desplace la grilla
      }}
    >
      {datos.celdas.map((celda, idx) => (
        <div 
          key={celda.id || idx}
          className="celda-banner-item"
          onClick={() => abrirEditor(id, datos, 'banner')}
          style={{ 
            gridColumn: `span ${celda.ancho || 1}`,
            backgroundColor: celda.tipo === 'texto' ? (celda.colorFondo || '#f4f4f4') : 'transparent',
            border: '0.1pt solid rgba(0,0,0,0.1)',
            height: '100%' 
          }}
        >
          {celda.tipo === 'imagen' ? (
            <div className="banner-img-wrapper">
              {celda.contenido ? (
                <img src={celda.contenido} alt="Banner" className="banner-img-render" />
              ) : (
                <span className="no-img-text no-print" style={{ fontSize: '10px', color: '#ccc' }}>
                  Sin imagen
                </span>
              )}
            </div>
          ) : (
            <div className="banner-text-wrapper" style={{ color: celda.colorTexto || '#333' }}>
              {celda.contenido || "TEXTO"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Banner;
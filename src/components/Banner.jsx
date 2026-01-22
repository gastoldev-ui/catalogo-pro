import React from 'react';
import '../styles/banner.css';

const Banner = ({ id, datos, abrirEditor }) => {
  const bloques = Array.isArray(datos) ? datos : [];

  if (bloques.length === 0) {
    return (
      <div className="banner-grid-container empty no-print" onClick={() => abrirEditor(id, datos, 'banner')}>
        <div className="banner-placeholder">+ AGREGAR BLOQUES</div>
      </div>
    );
  }

  return (
    <div className="banner-grid-container" onClick={() => abrirEditor(id, datos, 'banner')}>
      {bloques.map((b, idx) => (
        <div 
          key={idx}
          className="banner-block-full" 
          style={{
            gridColumnStart: b.desde,
            gridColumnEnd: b.hasta + 1,
            backgroundColor: b.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 10px'
          }}
        >
          <span className="banner-text">{b.texto}</span>
        </div>
      ))}
    </div>
  );
};

export default Banner;
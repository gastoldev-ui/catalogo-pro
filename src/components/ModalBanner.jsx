import React, { useState } from 'react';

const ModalBanner = ({ banner, id, alGuardar, alCerrar, columnasTotales }) => {
  const [celdas, setCeldas] = useState(banner?.celdas || [
    { 
      id: Date.now(), 
      ancho: columnasTotales, 
      tipo: 'texto', 
      contenido: '', 
      colorFondo: '#1a5fb4',
      colorTexto: '#ffffff' 
    }
  ]);

  const anchoOcupado = celdas.reduce((acc, c) => acc + Number(c.ancho), 0);
  const espacioRestante = columnasTotales - anchoOcupado;
  const esAnchoValido = anchoOcupado <= columnasTotales;

  const actualizarCelda = (index, campo, valor) => {
    const nuevas = [...celdas];
    nuevas[index][campo] = valor;
    setCeldas(nuevas);
  };

  return (
    <>
      {/* Header Compacto igual al de Productos */}
      <div className={`modal-header ${esAnchoValido ? 'bg-dark' : 'bg-danger'} text-white py-2 px-3`}>
        <h6 className="modal-title m-0">
          📏 Configurar Banners ({anchoOcupado}/{columnasTotales})
        </h6>
        <button type="button" className="btn-close btn-close-white shadow-none" onClick={alCerrar} style={{ scale: '0.8' }}></button>
      </div>

      <div className="modal-body bg-secondary-subtle p-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
        {celdas.map((celda, index) => (
          <div key={celda.id} className="card shadow-sm mb-3 border-0">
            <div className="card-body p-2">
              <div className="row g-2 mb-2 align-items-end">
                <div className="col-5">
                  <label className="form-label mb-0 small fw-bold text-muted" style={{ fontSize: '0.65rem' }}>TIPO</label>
                  <select className="form-select form-select-sm" value={celda.tipo} onChange={(e) => actualizarCelda(index, 'tipo', e.target.value)}>
                    <option value="texto">Texto</option>
                    <option value="imagen">Imagen (URL)</option>
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label mb-0 small fw-bold text-muted" style={{ fontSize: '0.65rem' }}>ANCHO</label>
                  <input 
                    type="number" className="form-control form-control-sm text-center"
                    min="1" max={columnasTotales} 
                    value={celda.ancho} 
                    onChange={(e) => actualizarCelda(index, 'ancho', Number(e.target.value))}
                  />
                </div>
                <div className="col-3">
                  <button className="btn btn-sm btn-outline-danger w-100 py-1" onClick={() => setCeldas(celdas.filter((_, i) => i !== index))}>
                    Borrar
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <input 
                  className="form-control form-control-sm"
                  placeholder={celda.tipo === 'texto' ? "Escribe el mensaje aquí..." : "Pega el enlace de la imagen..."}
                  value={celda.contenido}
                  onChange={(e) => actualizarCelda(index, 'contenido', e.target.value)}
                />
              </div>

              {celda.tipo === 'texto' && (
                <div className="row g-2 mt-1">
                  <div className="col-6 d-flex align-items-center">
                    <label className="small text-muted me-2" style={{ fontSize: '0.6rem' }}>FONDO</label>
                    <input type="color" className="form-control form-control-color border-0 p-0" style={{ height: '24px', width: '100%' }} value={celda.colorFondo} onChange={(e) => actualizarCelda(index, 'colorFondo', e.target.value)} />
                  </div>
                  <div className="col-6 d-flex align-items-center">
                    <label className="small text-muted me-2" style={{ fontSize: '0.6rem' }}>TEXTO</label>
                    <input type="color" className="form-control form-control-color border-0 p-0" style={{ height: '24px', width: '100%' }} value={celda.colorTexto || '#ffffff'} onChange={(e) => actualizarCelda(index, 'colorTexto', e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {espacioRestante > 0 && (
          <button 
            className="btn btn-outline-primary btn-sm w-100 py-2" 
            style={{ borderStyle: 'dashed', borderWidth: '2px' }}
            onClick={() => setCeldas([...celdas, { id: Date.now(), ancho: 1, tipo: 'texto', contenido: '', colorFondo: '#e9ecef', colorTexto: '#000000' }])}
          >
            + Añadir Bloque (Quedan {espacioRestante} celdas)
          </button>
        )}

        {!esAnchoValido && (
          <div className="alert alert-danger mt-2 py-1 small text-center fw-bold">
            ⚠️ Superaste las {columnasTotales} columnas
          </div>
        )}
      </div>

      <div className="modal-footer py-2 px-3 bg-white">
        <button className="btn btn-sm btn-light border px-3" onClick={alCerrar}>Cancelar</button>
        <button 
          className="btn btn-sm btn-primary px-4 fw-bold" 
          disabled={!esAnchoValido || anchoOcupado === 0}
          onClick={() => alGuardar({ celdas })}
        >
          Guardar Fila
        </button>
      </div>
    </>
  );
};

export default ModalBanner;
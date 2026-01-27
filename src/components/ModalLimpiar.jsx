import React, { useState } from 'react';

const ModalLimpiar = ({ alConfirmar, alCerrar }) => {
  const [checks, setChecks] = useState({
    productos: true,
    banners: true,
    empresa: false
  });

  return (
    <>
      <div className="modal-header bg-danger text-white">
        <h5 className="modal-title">🗑️ Limpiar Catálogo</h5>
        <button type="button" className="btn-close btn-close-white" onClick={alCerrar}></button>
      </div>
      <div className="modal-body p-4">
        <p className="text-muted mb-4">Selecciona qué elementos deseas eliminar permanentemente:</p>
        
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="checkProds" 
            checked={checks.productos} onChange={() => setChecks({...checks, productos: !checks.productos})} />
          <label className="form-check-label fw-bold" htmlFor="checkProds">Eliminar todos los Productos</label>
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="checkBanners" 
            checked={checks.banners} onChange={() => setChecks({...checks, banners: !checks.banners})} />
          <label className="form-check-label fw-bold" htmlFor="checkBanners">Eliminar Banners y Filas</label>
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="checkEmpresa" 
            checked={checks.empresa} onChange={() => setChecks({...checks, empresa: !checks.empresa})} />
          <label className="form-check-label fw-bold text-danger" htmlFor="checkEmpresa">Borrar Datos de Empresa y Logo</label>
        </div>

        <div className="alert alert-warning mt-4 py-2 small">
          ⚠️ Esta acción no se puede deshacer.
        </div>
      </div>
      <div className="modal-footer bg-light">
        <button className="btn btn-secondary btn-sm" onClick={alCerrar}>Cancelar</button>
        <button 
          className="btn btn-danger btn-sm px-4" 
          disabled={!checks.productos && !checks.banners && !checks.empresa}
          onClick={() => alConfirmar(checks)}
        >
          Confirmar Limpieza
        </button>
      </div>
    </>
  );
};

export default ModalLimpiar;
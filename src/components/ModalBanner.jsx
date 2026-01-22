import React from 'react';

const ModalBanner = ({ tempEditor, setTempEditor, onHideEditor, guardarCambios }) => {
  // Aseguramos que 'datos' sea un array de 5 posiciones
  const slots = Array.isArray(tempEditor.datos) && tempEditor.datos.length === 5 
                ? tempEditor.datos 
                : Array(5).fill(null).map(() => ({ activo: false, texto: '', color: '#1a5fb4' }));

  const toggleSlot = (index) => {
    const nuevosSlots = [...slots];
    nuevosSlots[index].activo = !nuevosSlots[index].activo;
    setTempEditor({ ...tempEditor, datos: nuevosSlots });
  };

  const updateSlot = (index, campo, valor) => {
    const nuevosSlots = [...slots];
    nuevosSlots[index] = { ...nuevosSlots[index], [campo]: valor };
    setTempEditor({ ...tempEditor, datos: nuevosSlots });
  };

  return (
    <>
      <div className="modal-header border-secondary text-center d-block position-relative">
        <h5 className="modal-title text-info">CONFIGURAR BLOQUES DEL BANNER</h5>
        <small className="text-secondary">Seleccioná los espacios que querés usar</small>
        <button type="button" className="btn-close btn-close-white position-absolute end-0 top-0 m-3" onClick={onHideEditor}></button>
      </div>

      <div className="modal-body">
        {/* Visualizador de los 5 Slots */}
        <div className="d-flex gap-1 mb-4" style={{ height: '45px' }}>
          {slots.map((s, i) => (
            <div 
              key={i}
              onClick={() => toggleSlot(i)}
              style={{
                flex: 1,
                cursor: 'pointer',
                backgroundColor: s.activo ? s.color : '#222',
                border: s.activo ? '2px solid white' : '1px dashed #555',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                color: s.activo ? 'white' : '#777',
                transition: 'all 0.2s ease'
              }}
            >
              {s.activo ? 'ACTIVO' : 'VACÍO'}
            </div>
          ))}
        </div>

        {/* Lista de inputs para slots activos */}
        <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
          {slots.some(s => s.activo) ? (
            slots.map((s, i) => s.activo && (
              <div key={i} className="p-3 mb-3 border border-secondary rounded bg-black shadow-sm">
                <div className="row g-2 align-items-center">
                  <div className="col-1">
                    <span className="badge bg-info text-dark">#{i+1}</span>
                  </div>
                  <div className="col-7">
                    <input 
                      type="text" 
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      placeholder="ESCRIBE AQUÍ..."
                      value={s.texto}
                      onChange={e => updateSlot(i, 'texto', e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="col-3">
                    <input 
                      type="color" 
                      className="form-control form-control-sm form-control-color bg-dark border-secondary w-100"
                      value={s.color}
                      onChange={e => updateSlot(i, 'color', e.target.value)}
                    />
                  </div>
                  <div className="col-1 text-end">
                    <button className="btn btn-sm btn-outline-danger border-0" onClick={() => toggleSlot(i)}>
                      <i className="bi bi-trash"></i> ×
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 border border-secondary border-dashed rounded">
              <p className="text-secondary m-0 small">Hacé clic en los bloques grises de arriba para empezar</p>
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer border-secondary">
        <button className="btn btn-secondary" onClick={onHideEditor}>CANCELAR</button>
        <button className="btn btn-info px-4 fw-bold" onClick={guardarCambios}>APLICAR CAMBIOS</button>
      </div>
    </>
  );
};

export default ModalBanner;
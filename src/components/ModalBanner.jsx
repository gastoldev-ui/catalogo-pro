import React from 'react';

const ModalBanner = ({ tempEditor, setTempEditor, onHideEditor, guardarCambios }) => {
  const bloques = Array.isArray(tempEditor.datos) ? tempEditor.datos : [];

  const agregarBloque = () => {
    const nuevo = { texto: '', color: '#1a5fb4', desde: 1, hasta: 1 };
    setTempEditor({ ...tempEditor, datos: [...bloques, nuevo] });
  };

  const eliminarBloque = (index) => {
    setTempEditor({ ...tempEditor, datos: bloques.filter((_, i) => i !== index) });
  };

  const update = (index, campo, valor) => {
    const nuevos = [...bloques];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setTempEditor({ ...tempEditor, datos: nuevos });
  };

  return (
    <>
      <div className="modal-header border-secondary d-flex justify-content-between align-items-center">
        <h5 className="modal-title text-info fw-bold">EDITOR DE BLOQUES MÚLTIPLES</h5>
        <button className="btn btn-sm btn-outline-info" onClick={agregarBloque}>+ AÑADIR BLOQUE</button>
      </div>

      <div className="modal-body bg-dark">
        {/* VISTA PREVIA RÁPIDA */}
        <div className="banner-grid-container mb-4" style={{ height: '30px', border: '1px solid #444' }}>
          {bloques.map((b, i) => (
            <div key={i} style={{
              gridColumnStart: b.desde,
              gridColumnEnd: b.hasta + 1,
              backgroundColor: b.color,
              border: '1px solid white',
              fontSize: '9px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {b.texto || `B${i+1}`}
            </div>
          ))}
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {bloques.map((b, i) => (
            <div key={i} className="p-3 mb-3 border border-secondary rounded bg-black">
              <div className="row g-2 align-items-end">
                <div className="col-4">
                  <label className="small text-secondary">TEXTO</label>
                  <input type="text" className="form-control form-control-sm bg-dark text-white border-secondary" 
                    value={b.texto} onChange={e => update(i, 'texto', e.target.value.toUpperCase())} />
                </div>
                <div className="col-2">
                  <label className="small text-secondary">DESDE</label>
                  <select className="form-select form-select-sm bg-dark text-white border-secondary" 
                    value={b.desde} onChange={e => update(i, 'desde', parseInt(e.target.value))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="col-2">
                  <label className="small text-secondary">HASTA</label>
                  <select className="form-select form-select-sm bg-dark text-white border-secondary" 
                    value={b.hasta} onChange={e => update(i, 'hasta', parseInt(e.target.value))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="col-2">
                  <label className="small text-secondary">COLOR</label>
                  <input type="color" className="form-control form-control-color bg-dark border-secondary w-100" 
                    value={b.color} onChange={e => update(i, 'color', e.target.value)} />
                </div>
                <div className="col-2">
                  <button className="btn btn-sm btn-danger w-100" onClick={() => eliminarBloque(i)}>ELIMINAR</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-footer border-secondary">
        <button className="btn btn-secondary" onClick={onHideEditor}>CANCELAR</button>
        <button className="btn btn-info px-4 fw-bold" onClick={guardarCambios}>APLICAR</button>
      </div>
    </>
  );
};

export default ModalBanner;
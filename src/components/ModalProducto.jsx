import React, { useState, useEffect } from 'react';

const ModalProducto = ({ producto, alGuardar, alCerrar }) => {
  const [editado, setEditado] = useState({
    nombre: '', precioLista: '', foto: '', cod: '',
    tipoPack: 'PACK', cantidad: 1, unidad: 'UDS',
    tipoOferta: 'ninguna', ofertaDirecta: '',
    promoCant: '', promoPrecio: '', lleva: '', paga: '',
    ...producto
  });

  useEffect(() => {
    if (producto) setEditado(prev => ({ ...prev, ...producto }));
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditado(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Header con un azul más oscuro y compacto */}
      <div className="modal-header bg-dark text-white py-2 px-3">
        <h6 className="modal-title m-0">
          {producto?.nombre ? '📝 Editar Producto' : '🆕 Nuevo Producto'}
        </h6>
        <button type="button" className="btn-close btn-close-white shadow-none" onClick={alCerrar} style={{ scale: '0.8' }}></button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); alGuardar(editado); }}>
        {/* Cuerpo con fondo gris sutil y scroll compacto */}
        <div className="modal-body bg-secondary-subtle p-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          
          {/* Fila Nombre y Código */}
          <div className="row g-2 mb-2">
            <div className="col-8">
              <label className="form-label mb-0 small fw-bold text-muted">Nombre</label>
              <input name="nombre" className="form-control form-control-sm" value={editado.nombre || ''} onChange={handleChange} required />
            </div>
            <div className="col-4">
              <label className="form-label mb-0 small fw-bold text-muted">Código</label>
              <input name="cod" className="form-control form-control-sm" value={editado.cod || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Fila Precios y Pack */}
          <div className="row g-2 mb-3 align-items-end">
            <div className="col-4">
              <label className="form-label mb-0 small fw-bold text-primary">Precio Lista ($)</label>
              <input type="number" name="precioLista" className="form-control form-control-sm border-primary" value={editado.precioLista || ''} onChange={handleChange} step="0.01" required />
            </div>
            <div className="col-3">
              <label className="form-label mb-0 small fw-bold text-muted">Tipo</label>
              <select name="tipoPack" className="form-select form-select-sm" value={editado.tipoPack} onChange={handleChange}>
                <option value="PACK">PACK</option>
                <option value="CAJA">CAJA</option>
                <option value="DISPLAY">DISPLAY</option>
              </select>
            </div>
            <div className="col-2">
              <label className="form-label mb-0 small fw-bold text-muted">Cant.</label>
              <input type="number" name="cantidad" className="form-control form-control-sm" value={editado.cantidad} onChange={handleChange} />
            </div>
            <div className="col-3">
              <label className="form-label mb-0 small fw-bold text-muted">Unidad</label>
              <input name="unidad" className="form-control form-control-sm" value={editado.unidad} onChange={handleChange} />
            </div>
          </div>

          {/* Caja de Oferta más oscura y compacta */}
          <div className="card border-secondary shadow-sm mb-3">
            <div className="card-header bg-secondary text-white py-1 px-2 small font-weight-bold text-center" style={{ fontSize: '0.7rem' }}>
              CONFIGURACIÓN DE OFERTA
            </div>
            <div className="card-body p-2 bg-white">
              <div className="d-flex justify-content-around gap-1 mb-2">
                {['ninguna', 'directa', 'cantidad', 'bonificado'].map(tipo => (
                  <div key={tipo} className="form-check p-0 m-0">
                    <input 
                      type="radio" className="btn-check" name="tipoOferta" 
                      id={`opt-${tipo}`} value={tipo} 
                      checked={editado.tipoOferta === tipo} onChange={handleChange} 
                    />
                    <label className={`btn btn-sm ${editado.tipoOferta === tipo ? 'btn-primary' : 'btn-outline-secondary'} py-0 px-2`} 
                           style={{ fontSize: '0.65rem' }} htmlFor={`opt-${tipo}`}>
                      {tipo.toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>

              <div className="row g-2">
                {editado.tipoOferta === 'directa' && (
                  <div className="col-12"><input type="number" name="ofertaDirecta" className="form-control form-control-sm border-warning" placeholder="Precio Oferta ($)" value={editado.ofertaDirecta} onChange={handleChange} /></div>
                )}
                {editado.tipoOferta === 'cantidad' && (
                  <><div className="col-6"><input type="number" name="promoCant" className="form-control form-control-sm" placeholder="Cant." value={editado.promoCant} onChange={handleChange} /></div>
                    <div className="col-6"><input type="number" name="promoPrecio" className="form-control form-control-sm border-warning" placeholder="Precio Total" value={editado.promoPrecio} onChange={handleChange} /></div></>
                )}
                {editado.tipoOferta === 'bonificado' && (
                  <><div className="col-6"><input type="number" name="lleva" className="form-control form-control-sm" placeholder="Lleva" value={editado.lleva} onChange={handleChange} /></div>
                    <div className="col-6"><input type="number" name="paga" className="form-control form-control-sm border-warning" placeholder="Paga" value={editado.paga} onChange={handleChange} /></div></>
                )}
              </div>
            </div>
          </div>

          {/* Imagen URL Compacta */}
          <div className="mb-1">
            <label className="form-label mb-0 small fw-bold text-muted">URL Imagen</label>
            <input name="foto" className="form-control form-control-sm shadow-none" value={editado.foto || ''} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        {/* Vista previa de imagen antes de guardar */}
          {editado.foto && (
            <div className="text-center mt-2 p-2 bg-white rounded border">
              <img 
                src={editado.foto} 
                alt="Vista previa" 
                style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }}
                onError={(e) => e.target.style.display = 'none'} // Si el link es malo, se oculta
              />
              <div className="small text-muted" style={{ fontSize: '10px' }}>Vista previa de imagen</div>
            </div>
          )}

        {/* Footer más pequeño */}
        <div className="modal-footer py-2 px-3">
          <button type="button" className="btn btn-sm btn-light border" onClick={alCerrar}>Cancelar</button>
          <button type="submit" className="btn btn-sm btn-primary px-3 fw-bold">Guardar Producto</button>
        </div>
      </form>
    </>
  );
};

export default ModalProducto;
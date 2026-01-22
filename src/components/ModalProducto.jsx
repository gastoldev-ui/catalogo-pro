import React from 'react';

const ModalProducto = ({ tempEditor, setTempEditor, onHideEditor, guardarCambios, eliminarProducto }) => {
  
  // Función auxiliar para actualizar campos anidados
  const updateDatos = (campo, valor) => {
    setTempEditor({
      ...tempEditor,
      datos: { ...tempEditor.datos, [campo]: valor }
    });
  };

  return (
    <>
      <div className="modal-header border-secondary">
        <h5 className="modal-title text-info">EDITAR PRODUCTO</h5>
        <button type="button" className="btn-close btn-close-white" onClick={onHideEditor}></button>
      </div>

      <div className="modal-body">
        <div className="row g-3">
          {/* Nombre del Producto */}
          <div className="col-12">
            <label className="fw-bold small text-info">NOMBRE DEL PRODUCTO</label>
            <input 
              type="text" 
              className="form-control bg-dark text-white border-secondary"
              value={tempEditor.datos.nombre || ''}
              onChange={e => updateDatos('nombre', e.target.value.toUpperCase())}
            />
          </div>

          {/* Precio y Código */}
          <div className="col-6">
            <label className="fw-bold small text-info">PRECIO LISTA ($)</label>
            <input 
              type="number" 
              className="form-control bg-dark text-white border-secondary"
              value={tempEditor.datos.precioLista || ''}
              onChange={e => updateDatos('precioLista', e.target.value)}
            />
          </div>

          <div className="col-6">
            <label className="fw-bold small text-info">CÓDIGO / ID</label>
            <input 
              type="text" 
              className="form-control bg-dark text-white border-secondary"
              value={tempEditor.datos.cod || ''}
              onChange={e => updateDatos('cod', e.target.value)}
            />
          </div>

          {/* Sección Logística */}
          <div className="col-4">
            <label className="fw-bold small text-info">TIPO PACK</label>
            <select 
              className="form-select bg-dark text-white border-secondary"
              value={tempEditor.datos.tipoPack || 'CAJA'}
              onChange={e => updateDatos('tipoPack', e.target.value)}
            >
              <option value="CAJA">CAJA</option>
              <option value="DISPLAY">DISPLAY</option>
              <option value="BOLSA">BOLSA</option>
              <option value="PACK">PACK</option>
              <option value="BOTELLA">BOTELLA</option>
            </select>
          </div>

          <div className="col-4">
            <label className="fw-bold small text-info">CANTIDAD</label>
            <input 
              type="number" 
              className="form-control bg-dark text-white border-secondary"
              value={tempEditor.datos.cantidad || ''}
              onChange={e => updateDatos('cantidad', e.target.value)}
            />
          </div>

          <div className="col-4">
            <label className="fw-bold small text-info">UNIDAD</label>
            <select 
              className="form-select bg-dark text-white border-secondary"
              value={tempEditor.datos.unidad || 'UDS.'}
              onChange={e => updateDatos('unidad', e.target.value)}
            >
              <option value="UDS.">UDS.</option>
              <option value="KG.">KG.</option>
              <option value="LTS.">LTS.</option>
              <option value="GR.">GR.</option>
            </select>
          </div>

          {/* Foto */}
          <div className="col-12">
            <label className="fw-bold small text-info">URL DE LA FOTO</label>
            <input 
              type="text" 
              className="form-control bg-dark text-white border-secondary"
              placeholder="https://ejemplo.com/foto.jpg"
              value={tempEditor.datos.foto || ''}
              onChange={e => updateDatos('foto', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="modal-footer border-secondary d-flex justify-content-between">
        <button className="btn btn-outline-danger" onClick={() => eliminarProducto(tempEditor.id)}>
          ELIMINAR PRODUCTO
        </button>
        
        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={onHideEditor}>CANCELAR</button>
          <button className="btn btn-info px-4" onClick={guardarCambios}>
            GUARDAR
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalProducto;
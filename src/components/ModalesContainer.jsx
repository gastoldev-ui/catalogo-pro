import React from 'react';
import ModalProducto from './ModalProducto';
import ModalBanner from './ModalBanner';
import ModalLimpiar from './ModalLimpiar';

const ModalesContainer = ({ showEditor, onHideEditor, tempEditor, guardarCambios, columnasTotales }) => {
  if (!showEditor || !tempEditor) return null;

  return (
    /* Capa oscura de fondo (Overlay) */
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}
      onClick={onHideEditor}
    >
      {/* modal-md lo hace de tamaño mediano, ideal para que no quede gigante */}
      <div 
        className="modal-dialog modal-dialog-centered modal-md" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow border-0 overflow-hidden">
          {tempEditor && (
            <>
              {tempEditor.tipo === 'producto' && (
                <ModalProducto 
                  producto={tempEditor.datos} 
                  alGuardar={guardarCambios} 
                  alCerrar={onHideEditor} 
                />
              )}

              {tempEditor.tipo === 'banner' && (
                <ModalBanner 
                  banner={tempEditor.datos} 
                  id={tempEditor.id} 
                  columnasTotales={columnasTotales} 
                  alGuardar={guardarCambios} 
                  alCerrar={onHideEditor} 
                />
              )}

              {tempEditor.tipo === 'limpiar' && (
                <ModalLimpiar 
                  alConfirmar={guardarCambios} 
                  alCerrar={onHideEditor} 
                />
              )}
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ModalesContainer;
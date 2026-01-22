import React from 'react';
import ModalProducto from './ModalProducto';
import ModalBanner from './ModalBanner';

const ModalesContainer = (props) => {
  if (!props.showEditor) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg"> {/* modal-lg para más espacio */}
        <div className="modal-content bg-dark text-white border-secondary">
          {props.tempEditor.tipo === 'producto' ? (
            <ModalProducto {...props} />
          ) : (
            <ModalBanner {...props} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalesContainer;
import React from 'react';
import '../styles/tarjeta.css';

const Tarjeta = ({ index, producto, abrirEditor }) => {
  const pLista = parseFloat(producto.precioLista) || 0;
  let textoOferta = "";
  let ahorro = 0;
  let precioUnitarioFinal = 0;

  // --- Lógica de ofertas (se mantiene igual, está perfecta) ---
  if (producto.tipoOferta === 'directa' && producto.ofertaDirecta) {
    precioUnitarioFinal = Math.round(parseFloat(producto.ofertaDirecta));
    textoOferta = `$${precioUnitarioFinal}`;
    if (pLista > precioUnitarioFinal) ahorro = Math.round(((pLista - precioUnitarioFinal) / pLista) * 100);
  } 
  else if (producto.tipoOferta === 'cantidad' && producto.promoCant && producto.promoPrecio) {
    const cant = parseFloat(producto.promoCant);
    const total = parseFloat(producto.promoPrecio);
    precioUnitarioFinal = Math.round(total / cant);
    textoOferta = `${cant} X $${total}`;
    if (pLista > precioUnitarioFinal) ahorro = Math.round(((pLista - precioUnitarioFinal) / pLista) * 100);
  } 
  else if (producto.tipoOferta === 'bonificado' && producto.lleva && producto.paga) {
    const lleva = parseFloat(producto.lleva);
    const paga = parseFloat(producto.paga);
    precioUnitarioFinal = Math.round((paga * pLista) / lleva);
    textoOferta = `${lleva} X ${paga}`;
    if (lleva > paga) ahorro = Math.round(((lleva - paga) / lleva) * 100);
  }

  return (
    <div className="tarjeta" onClick={() => abrirEditor(index, producto, 'producto')}>
      {ahorro > 0 && <div className="badge-diagonal">{ahorro}% OFF</div>}
      
      {/* Bloque superior de precios */}
      <div className="precios-container">
        {textoOferta ? (
          <>
            <span className="precio-tachado">${pLista}</span>
            <span className="precio-oferta">{textoOferta}</span>
            <div className="precio-unitario-final">C/U ${precioUnitarioFinal}</div>
          </>
        ) : (
          <span className="precio-normal">${pLista}</span>
        )}
      </div>

      {/* Contenedor elástico de foto */}
      <div className="foto-contenedor">
        {producto.foto ? (
          <img src={producto.foto} alt={producto.nombre} className="img-tarjeta" />
        ) : (
          <div className="foto-placeholder">S/F</div>
        )}
      </div>

      {/* Texto centrado */}
      <div className="nombre-producto">{producto.nombre || "SIN NOMBRE"}</div>

      {/* Footer siempre al fondo */}
      <div className="tarjeta-footer">
        <span className="pack-info">
          {producto.tipoPack} {producto.cantidad} {producto.unidad}
        </span>
        <span className="codigo-id">#{producto.cod || index}</span>
      </div>
    </div>
  );
};

export default Tarjeta;
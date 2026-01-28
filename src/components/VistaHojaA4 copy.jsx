import React, { useState } from 'react';
import Tarjeta from './Tarjeta';
import Banner from './Banner';
import '../styles/vistaHojaA4.css';

const VistaHojaA4 = ({ productos, datos, bannersManuales, abrirEditor }) => {
  // Estados para la grilla dinámica
  const [columnas, setColumnas] = useState(5);
  const [filasPorHoja, setFilasPorHoja] = useState(4);
  
  // CLAVE: El límite de productos por hoja ahora cambia según el slider
  const prodsPorHoja = columnas * filasPorHoja;

  // Repaginamos el array de productos cada vez que cambian las filas o columnas
  const paginas = [];
  if (productos.length === 0) {
    paginas.push([]); // Una hoja vacía si no hay nada
  } else {
    for (let i = 0; i < productos.length; i += prodsPorHoja) {
      paginas.push(productos.slice(i, i + prodsPorHoja));
    }
  }

  return (
    <div className="hojas-lista-wrapper">
      
      {/* Selector de Grilla - Solo Pantalla */}
      <div className="control-grilla-flotante no-print">
        <div className="control-group">
          <label>Columnas: {columnas}</label>
          <input type="range" min="1" max="6" value={columnas} onChange={(e) => setColumnas(Number(e.target.value))} />
        </div>
        <div className="control-group">
          <label>Filas por Hoja (Máx 4): {filasPorHoja}</label>
          <input type="range" min="1" max="4" value={filasPorHoja} onChange={(e) => setFilasPorHoja(Number(e.target.value))} />
        </div>
        <div className="info-badge">
          {prodsPorHoja} prods. por carilla
        </div>
      </div>

      {paginas.map((grupo, numPag) => (
        <article className="vista-hoja-a4" key={numPag}>
          
          <header className="header-empresa">
            <div className="marca-lineal">
              {/* 1. Logo (si existe) */}
              {datos.logoUrl && (
                <img src={datos.logoUrl} alt="Logo" className="logo-img" />
              )}
              
              {/* 2. Nombre (según el Switch del panel) */}
              {datos.mostrarNombre !== false && (
                <h1 className="nombre-texto">{datos.nombre || "CATÁLOGO"}</h1>
              )}
            </div>

            {/* 3. Datos de contacto (Siempre visibles) */}
            <div className="datos-contacto-lineal">
              <span>{datos.dir}</span>
              {datos.dir && datos.tel && <span className="separador">|</span>}
              <span className="tel-negrita">{datos.tel}</span>
            </div>
          </header>
          
          <section className="cuerpo-catalogo">
            {/* Solo dibujamos la cantidad de filas permitidas por hoja */}
            {[...Array(filasPorHoja)].map((_, filaIdx) => {
              const productosFila = grupo.slice(filaIdx * columnas, (filaIdx * columnas) + columnas);
              const idBanner = `${numPag}-${filaIdx}`;
              
              return (
                <React.Fragment key={filaIdx}>
                  <Banner 
                    id={idBanner} 
                    datos={bannersManuales[idBanner]} 
                    abrirEditor={abrirEditor} 
                  />

                  <div 
                    className="fila-productos-contenedor" 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${columnas}, 1fr)`,
                      /* El 240mm es el espacio útil del A4 restando el header */
                      height: `${240 / filasPorHoja}mm`, 
                      borderBottom: '0.1pt solid #eee'
                    }}
                  >
                    {[...Array(columnas)].map((_, colIdx) => {
                      const prod = productosFila[colIdx];
                      // El indexReal asegura que al editar, toques el producto correcto del array global
                      const indexReal = (numPag * prodsPorHoja) + (filaIdx * columnas) + colIdx;

                      return prod ? (
                        <Tarjeta 
                          key={colIdx} 
                          index={indexReal} 
                          producto={prod} 
                          abrirEditor={abrirEditor} 
                        />
                      ) : (
                        <div 
                          key={`empty-${colIdx}`}
                          className="tarjeta-placeholder no-print"
                          onClick={() => abrirEditor(indexReal, { nombre: '', precioLista: '' }, 'producto')}
                        >
                          <span className="icon-plus">+</span>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              );
            })}
          </section>
        </article>
      ))}
    </div>
  );
};

export default VistaHojaA4;
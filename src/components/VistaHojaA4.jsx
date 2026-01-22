import React from 'react';
import Tarjeta from './Tarjeta';
import Banner from './Banner';
import '../styles/vistaHojaA4.css';

const VistaHojaA4 = ({ productos, datos, bannersManuales, abrirEditor }) => {
  // Dividimos el array de productos en páginas de 20
  const paginas = [];
  for (let i = 0; i < productos.length; i += 20) {
    paginas.push(productos.slice(i, i + 20));
  }

  // Si no hay productos, mostramos una hoja base
  if (paginas.length === 0) paginas.push([]);

    return (
      <div className="hojas-lista-wrapper"> {/* Reemplaza a container/row */}
        {paginas.map((grupo, numPag) => (
          <article className="vista-hoja-a4" key={numPag}>
            
            <header className="header-empresa">
              {/* Estructura lineal pura sin clases de Bootstrap */}
              <div className="marca-lineal">
                  {datos.logoUrl && <img src={datos.logoUrl} alt="Logo" className="logo-img" />}
                  <h1 className="nombre-texto">{datos.nombre}</h1>
              </div>
              <div className="datos-contacto-lineal">
                  <span>{datos.dir}</span>
                  <span className="separador">|</span>
                  <span className="tel-negrita">{datos.tel}</span>
                  <span className="separador">|</span>
                  <span className="fecha">{new Date().toLocaleDateString()}</span>
              </div>
            </header>

            <section className="cuerpo-catalogo">
              {[0, 1, 2, 3].map((filaIdx) => {
                const productosFila = grupo.slice(filaIdx * 5, (filaIdx * 5) + 5);
                const idBanner = `${numPag}-${filaIdx}`;
                
                return (
                  <React.Fragment key={filaIdx}>
                    <Banner 
                      id={idBanner} 
                      datos={bannersManuales[idBanner]} 
                      abrirEditor={abrirEditor} 
                    />

                    {/* Esta es tu grilla pura de 5 columnas */}
                    <div className="fila-productos-contenedor">
                      {productosFila.map((prod, pIdx) => (
                        <Tarjeta 
                          key={pIdx} 
                          index={(numPag * 20) + (filaIdx * 5) + pIdx} 
                          producto={prod} 
                          abrirEditor={abrirEditor} 
                        />
                      ))}
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
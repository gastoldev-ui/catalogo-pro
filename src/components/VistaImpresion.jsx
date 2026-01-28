import React from 'react';
import Tarjeta from './Tarjeta';
import Banner from './Banner';
import '../styles/vistaImpresion.css';

const VistaImpresion = ({ 
  productos, 
  datos, 
  bannersManuales, 
  abrirEditor, 
  columnas, 
  filasPorHoja,
  tipoHoja,
  medidaCustom,
  orientacion
}) => {

  // 1. Configuración de medidas físicas (en mm)
  const MEDIDAS_HOJAS = {
    'A4': { ancho: 210, alto: 297 },
    'OFICIO': { ancho: 210, alto: 355 },
    'A5': { ancho: 148, alto: 210 },
    'CUSTOM': medidaCustom
  };

    // a. Buscamos las medidas base según el tipo de hoja
    const dimensionesBase = MEDIDAS_HOJAS[tipoHoja] || MEDIDAS_HOJAS['A4'];

    // b. Aplicamos la rotación si es necesario
    const dimensiones = orientacion === 'horizontal' 
      ? { ancho: dimensionesBase.alto, alto: dimensionesBase.ancho }
      : dimensionesBase;
  

  // 2. Matemática de espacios (mm)
  const ALTO_HEADER = 22; 
  const MARGEN_SEGURIDAD = 10; 
  const ALTO_UTIL = dimensiones.alto - ALTO_HEADER - MARGEN_SEGURIDAD;
  
  // Cada "bloque" es (1 Banner + 1 Fila de productos)
  const ALTO_BLOQUE_FILA = ALTO_UTIL / filasPorHoja;
  const ALTO_BANNER = 8; // Altura fija del banner
  const ALTO_GRILLA_PRODS = ALTO_BLOQUE_FILA - ALTO_BANNER;

  // 3. Lógica de paginación
  const prodsPorHoja = columnas * filasPorHoja;
  const paginas = [];
  if (productos.length === 0) {
    paginas.push([]); 
  } else {
    for (let i = 0; i < productos.length; i += prodsPorHoja) {
      paginas.push(productos.slice(i, i + prodsPorHoja));
    }
  }

  return (
    <div className="contenedor-impresion-wrapper">
      {paginas.map((grupo, numPag) => (
        <article 
          className="hoja-impresion" 
          key={numPag}
          style={{ 
            width: `${dimensiones.ancho}mm`, 
            height: `${dimensiones.alto}mm` 
          }}
        >
          {/* CABECERA FIJA */}
          <header className="header-catalogo-fijo" style={{ height: `${ALTO_HEADER}mm` }}>
            <div className="marca-lineal">
              {datos.logoUrl && <img src={datos.logoUrl} alt="Logo" className="logo-img-fija" />}
              {datos.mostrarNombre !== false && (
                <h1 className="nombre-texto-fijo">{datos.nombre || "CATÁLOGO"}</h1>
              )}
            </div>
            <div className="datos-contacto-fijos">
              <span>{datos.dir}</span>
              {datos.dir && datos.tel && <span className="separador">|</span>}
              <span className="tel-negrita">{datos.tel}</span>
            </div>
          </header>

          {/* CUERPO DE PRODUCTOS */}
          <section className="cuerpo-catalogo-fijo">
            {[...Array(filasPorHoja)].map((_, filaIdx) => {
              const productosFila = grupo.slice(filaIdx * columnas, (filaIdx * columnas) + columnas);
              const idBanner = `${numPag}-${filaIdx}`;
              
              return (
                <div 
                  key={filaIdx} 
                  className="bloque-fila-impresion" 
                  style={{ height: `${ALTO_BLOQUE_FILA}mm` }}
                >
                  {/* Espacio del Banner (Siempre ocupa lugar) */}
                  <div className="zona-banner-fija" style={{ height: `${ALTO_BANNER}mm` }}>
                    <Banner 
                      id={idBanner} 
                      datos={bannersManuales[idBanner]} 
                      abrirEditor={abrirEditor} 
                      columnas={columnas} 
                    />
                  </div>

                  {/* Grilla de productos */}
                  <div 
                    className="grilla-productos-fija" 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${columnas}, 1fr)`,
                      height: `${ALTO_GRILLA_PRODS}mm`
                    }}
                  >
                    {[...Array(columnas)].map((_, colIdx) => {
                      const prod = productosFila[colIdx];
                      const indexReal = (numPag * prodsPorHoja) + (filaIdx * columnas) + colIdx;

                      return prod ? (
                        <Tarjeta key={prod.id || indexReal} producto={prod} abrirEditor={abrirEditor} />
                      ) : (
                        <div 
                          key={colIdx} 
                          className="tarjeta-placeholder-fija no-print"
                          onClick={() => abrirEditor(indexReal, { nombre: '', precioLista: '' }, 'producto')}
                        >
                          <span>+</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>

          {/* INFO DE PÁGINA (Solo pantalla) */}
          <footer className="footer-paginado no-print">
            Hoja {numPag + 1} de {paginas.length} ({tipoHoja})
          </footer>
        </article>
      ))}
    </div>
  );
};

export default VistaImpresion;
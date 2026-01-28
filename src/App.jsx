import React, { useState, useEffect } from 'react';
import './styles/app.css'; 
import PanelControl from './components/PanelControl';
import VistaImpresion from './components/VistaImpresion'; // Cambiado el nombre
import ModalesContainer from './components/ModalesContainer';

function App() {
  // --- ESTADOS CON PERSISTENCIA ---
  const [productos, setProductos] = useState(() => JSON.parse(localStorage.getItem('cat_prods')) || []);
  const [bannersManuales, setBannersManuales] = useState(() => JSON.parse(localStorage.getItem('cat_banners')) || {});
  
  // Persistencia de Columnas y Filas
  const [columnas, setColumnas] = useState(() => Number(localStorage.getItem('cat_cols')) || 5);
  const [filasPorHoja, setFilasPorHoja] = useState(() => Number(localStorage.getItem('cat_filas')) || 4);

  // NUEVO: Persistencia de Formato de Hoja
  const [tipoHoja, setTipoHoja] = useState(() => localStorage.getItem('cat_tipo_hoja') || 'A4');
  const [medidaCustom, setMedidaCustom] = useState(() => 
    JSON.parse(localStorage.getItem('cat_medida_custom')) || { ancho: 210, alto: 297 }
  );
  const [orientacion, setOrientacion] = useState(() => localStorage.getItem('cat_orientacion') || 'vertical');
  const [datos, setDatos] = useState(() => JSON.parse(localStorage.getItem('cat_ajustes')) || { 
    nombre: '', 
    dir: '', 
    tel: '', 
    logoUrl: '',
    mostrarNombre: true 
  });
  
  // --- ESTADOS DE UI ---
  const [showModal, setShowModal] = useState(false);
  const [tempEditor, setTempEditor] = useState(null);

  // --- PERSISTENCIA AUTOMÁTICA ---
  useEffect(() => {
    localStorage.setItem('cat_prods', JSON.stringify(productos));
    localStorage.setItem('cat_banners', JSON.stringify(bannersManuales));
    localStorage.setItem('cat_ajustes', JSON.stringify(datos));
    localStorage.setItem('cat_cols', columnas.toString());
    localStorage.setItem('cat_filas', filasPorHoja.toString());
    // Guardamos la nueva configuración de hoja
    localStorage.setItem('cat_tipo_hoja', tipoHoja);
    localStorage.setItem('cat_medida_custom', JSON.stringify(medidaCustom));
  }, [productos, bannersManuales, datos, columnas, filasPorHoja, tipoHoja, medidaCustom, orientacion]);

  // --- LÓGICA DE APERTURA DE MODALES ---
  const abrirEditor = (id, info, tipo) => {
    setTempEditor({ id, datos: { ...info }, tipo });
    setShowModal(true);
  };

  // --- PROCESADOR CENTRAL DE CAMBIOS ---
  const guardarCambios = (nuevosDatos) => {
    if (tempEditor.tipo === 'producto') {
      setProductos(prev => {
        const existe = prev.find(p => p.id === tempEditor.id);
        if (existe) {
          return prev.map(p => p.id === tempEditor.id ? { ...p, ...nuevosDatos } : p);
        }
        return [...prev, { ...nuevosDatos, id: tempEditor.id }];
      });
    } 
    else if (tempEditor.tipo === 'banner') {
      setBannersManuales(prev => ({ ...prev, [tempEditor.id]: nuevosDatos }));
    } 
    else if (tempEditor.tipo === 'limpiar') {
      if (nuevosDatos.productos) {
        setProductos([]);
        localStorage.removeItem('cat_prods');
      }
      if (nuevosDatos.banners) {
        setBannersManuales({});
        localStorage.removeItem('cat_banners');
      }
      if (nuevosDatos.empresa) {
        setDatos({ nombre: '', dir: '', tel: '', logoUrl: '', mostrarNombre: true });
        localStorage.removeItem('cat_ajustes');
      }
    }

    setShowModal(false);
    setTempEditor(null);
  };

  return (
    <div className="app-container">
      {/* PANEL DE CONTROL: Recibe los nuevos setters de hoja */}
      <PanelControl 
        datos={datos} 
        setDatos={setDatos} 
        setProductos={setProductos}
        columnas={columnas} 
        setColumnas={setColumnas}
        filasPorHoja={filasPorHoja}
        setFilasPorHoja={setFilasPorHoja}
        tipoHoja={tipoHoja}
        setTipoHoja={setTipoHoja}
        medidaCustom={medidaCustom}
        setMedidaCustom={setMedidaCustom}
        totalProds={productos.length}
        abrirEditor={abrirEditor}
        orientacion={orientacion} 
        setOrientacion={setOrientacion}
      />

      {/* ÁREA DE PREVISUALIZACIÓN: Ahora con VistaImpresion y lógica de hoja */}
      <main className="main-preview-area">
        <VistaImpresion 
          productos={productos} 
          datos={datos} 
          bannersManuales={bannersManuales} 
          abrirEditor={abrirEditor}
          columnas={columnas}
          filasPorHoja={filasPorHoja}
          tipoHoja={tipoHoja}
          medidaCustom={medidaCustom}
          orientacion={orientacion}
        />
      </main>

      {/* CONTENEDOR DE MODALES */}
      <ModalesContainer 
        showEditor={showModal} 
        onHideEditor={() => {
          setShowModal(false);
          setTempEditor(null);
        }}
        tempEditor={tempEditor} 
        guardarCambios={guardarCambios}
        columnasTotales={columnas}
      />
    </div>
  );
}

export default App;
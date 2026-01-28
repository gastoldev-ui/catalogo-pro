import React, { useState, useEffect } from 'react';
import './styles/app.css'; 
import PanelControl from './components/PanelControl';
import VistaHojaA4 from './components/VistaHojaA4';
import ModalesContainer from './components/ModalesContainer';

function App() {
  // --- ESTADOS CON PERSISTENCIA ---
  const [productos, setProductos] = useState(() => JSON.parse(localStorage.getItem('cat_prods')) || []);
  const [bannersManuales, setBannersManuales] = useState(() => JSON.parse(localStorage.getItem('cat_banners')) || {});
  const [columnas, setColumnas] = useState(() => Number(localStorage.getItem('cat_cols')) || 5);
  const [datos, setDatos] = useState(() => JSON.parse(localStorage.getItem('cat_ajustes')) || { 
    nombre: '', 
    dir: '', 
    tel: '', 
    logoUrl: '',
    mostrarNombre: true // Valor por defecto
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
  }, [productos, bannersManuales, datos, columnas]);

  // --- LÓGICA DE APERTURA DE MODALES ---
  const abrirEditor = (id, info, tipo) => {
    setTempEditor({ id, datos: { ...info }, tipo });
    setShowModal(true);
  };

  // --- PROCESADOR CENTRAL DE CAMBIOS ---
  const guardarCambios = (nuevosDatos) => {
    // CASO 1: PRODUCTOS
    if (tempEditor.tipo === 'producto') {
      setProductos(prev => {
        const existe = prev.find(p => p.id === tempEditor.id);
        if (existe) {
          return prev.map(p => p.id === tempEditor.id ? { ...p, ...nuevosDatos } : p);
        }
        return [...prev, { ...nuevosDatos, id: tempEditor.id }];
      });
    } 
    // CASO 2: BANNERS
    else if (tempEditor.tipo === 'banner') {
      setBannersManuales(prev => ({
        ...prev,
        [tempEditor.id]: nuevosDatos
      }));
    } 
    // CASO 3: LIMPIEZA GRANULAR (Recibe el objeto de ModalLimpiar)
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
        setDatos({ nombre: '', dir: '', tel: '', logoUrl: '' });
        localStorage.removeItem('cat_ajustes');
      }
    }

    setShowModal(false);
    setTempEditor(null);
  };

  return (
    <div className="app-container">
      {/* PANEL DE CONTROL: Recibe las funciones para interactuar */}
      <PanelControl 
        datos={datos} 
        setDatos={setDatos} 
        setProductos={setProductos}
        columnas={columnas} 
        setColumnas={setColumnas}
        totalProds={productos.length}
        abrirEditor={abrirEditor}
      />

      {/* ÁREA DE PREVISUALIZACIÓN */}
      <main className="main-preview-area">
        <VistaHojaA4 
          productos={productos} 
          datos={datos} 
          bannersManuales={bannersManuales} 
          abrirEditor={abrirEditor}
          columnas={columnas}
        />
      </main>

      {/* CONTENEDOR DE MODALES: Maneja la lógica de guardado */}
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
import React, { useState, useEffect } from 'react';
import './styles/app.css'; 
import PanelControl from './components/PanelControl';
import VistaHojaA4 from './components/VistaHojaA4';
import ModalesContainer from './components/ModalesContainer';

function App() {
  // --- ESTADOS CON PERSISTENCIA ---
  const [productos, setProductos] = useState(() => JSON.parse(localStorage.getItem('cat_prods')) || []);
  const [bannersManuales, setBannersManuales] = useState(() => JSON.parse(localStorage.getItem('cat_banners')) || {});
  const [datos, setDatos] = useState(() => JSON.parse(localStorage.getItem('cat_ajustes')) || { nombre: '', dir: '', tel: '', logoUrl: '' });
  const [columnas, setColumnas] = useState(() => Number(localStorage.getItem('cat_cols')) || 5);

  // --- ESTADOS DE UI ---
  const [showModal, setShowModal] = useState(false);
  const [tempEditor, setTempEditor] = useState(null);

  useEffect(() => {
    localStorage.setItem('cat_prods', JSON.stringify(productos));
    localStorage.setItem('cat_banners', JSON.stringify(bannersManuales));
    localStorage.setItem('cat_ajustes', JSON.stringify(datos));
    localStorage.setItem('cat_cols', columnas.toString());
  }, [productos, bannersManuales, datos, columnas]);

  // --- LÓGICA DE NEGOCIO ---
  const abrirEditor = (id, info, tipo) => {
    setTempEditor({ id, datos: { ...info }, tipo });
    setShowModal(true);
  };

  const guardarCambios = (nuevosDatos) => {
    if (tempEditor.tipo === 'producto') {
      setProductos(prev => {
        const existe = prev.find(p => p.id === tempEditor.id);
        if (existe) {
          return prev.map(p => p.id === tempEditor.id ? { ...p, ...nuevosDatos } : p);
        }
        return [...prev, { ...nuevosDatos, id: tempEditor.id }];
      });
    } else {
      // Guardar Banner en el objeto de banners manuales
      setBannersManuales(prev => ({
        ...prev,
        [tempEditor.id]: nuevosDatos
      }));
    }
    setShowModal(false); // Corregido: antes decía setShowEditor
  };

  const resetearTodo = () => {
    if (window.confirm("¿Estás seguro? Se borrarán todos los productos y ajustes.")) {
      setProductos([]);
      setBannersManuales({});
      setDatos({ nombre: '', dir: '', tel: '', logoUrl: '' });
      localStorage.clear();
    }
  };

  return (
    <div className="app-container">
      {/* CORRECCIÓN: Pasamos resetearTodo y abrirEditor al Panel */}
      <PanelControl 
        datos={datos} 
        setDatos={setDatos} 
        setProductos={setProductos}
        columnas={columnas} 
        setColumnas={setColumnas}
        totalProds={productos.length}
        abrirEditor={abrirEditor}
        resetearTodo={resetearTodo} 
      />

      <main className="main-preview-area">
        <VistaHojaA4 
          productos={productos} 
          datos={datos} 
          bannersManuales={bannersManuales} 
          abrirEditor={abrirEditor}
          columnas={columnas}
        />
      </main>

      <ModalesContainer 
        showEditor={showModal} 
        onHideEditor={() => setShowModal(false)}
        tempEditor={tempEditor} 
        guardarCambios={guardarCambios}
        columnasTotales={columnas}
      />
    </div>
  );
}

export default App;
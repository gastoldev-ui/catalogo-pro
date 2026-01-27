import React, { useState, useEffect } from 'react';
import './styles/app.css'; 
import PanelControl from './components/PanelControl';
import VistaHojaA4 from './components/VistaHojaA4';
import ModalesContainer from './components/ModalesContainer';

function App() {
  // --- CARGA DESDE LOCALSTORAGE ---
  const [productos, setProductos] = useState(() => JSON.parse(localStorage.getItem('cat_prods')) || []);
  const [bannersManuales, setBannersManuales] = useState(() => JSON.parse(localStorage.getItem('cat_banners')) || {});
  const [datos, setDatos] = useState(() => JSON.parse(localStorage.getItem('cat_ajustes')) || { nombre: '', dir: '', tel: '' });
  const [columnas, setColumnas] = useState(() => Number(localStorage.getItem('cat_cols')) || 5);

  const [showModal, setShowModal] = useState(false);
  const [tempEditor, setTempEditor] = useState(null);

  // --- PERSISTENCIA AUTOMÁTICA ---
  useEffect(() => {
    localStorage.setItem('cat_prods', JSON.stringify(productos));
    localStorage.setItem('cat_banners', JSON.stringify(bannersManuales));
    localStorage.setItem('cat_ajustes', JSON.stringify(datos));
    localStorage.setItem('cat_cols', columnas.toString());
  }, [productos, bannersManuales, datos, columnas]);

  const abrirEditor = (id, info, tipo) => {
    setTempEditor({ id, datos: { ...info }, tipo });
    setShowModal(true);
  };

  const guardarCambios = (datosRecibidos) => {
    if (tempEditor.tipo === 'producto') {
      const nuevos = [...productos];
      if (tempEditor.id >= nuevos.length) nuevos.push(datosRecibidos);
      else nuevos[tempEditor.id] = datosRecibidos;
      setProductos(nuevos);
    } else {
      setBannersManuales(prev => ({ ...prev, [tempEditor.id]: datosRecibidos }));
    }
    setShowModal(false);
  };

  return (
    <div className="app-container">
      <PanelControl 
        datos={datos} setDatos={setDatos} 
        columnas={columnas} setColumnas={setColumnas}
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
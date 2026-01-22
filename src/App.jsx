import React, { useState, useEffect } from 'react';
import './styles/app.css'; // Centralizado
import PanelControl from './components/PanelControl';
import VistaHojaA4 from './components/VistaHojaA4';
import ModalesContainer from './components/ModalesContainer';
import { prepararDatosBanner } from './services/bannerHelpers';

function App() {
  // --- ESTADOS ---
  const [datos, setDatos] = useState(() => JSON.parse(localStorage.getItem('cat_ajustes')) || { nombre: 'Empresa', dir: '', tel: '', logoUrl: '' });
  const [productos, setProductos] = useState(() => JSON.parse(localStorage.getItem('cat_prods')) || []);
  const [bannersManuales, setBannersManuales] = useState(() => JSON.parse(localStorage.getItem('cat_banners')) || {});
  const [showModal, setShowModal] = useState(false);
  const [tempEditor, setTempEditor] = useState({ id: null, datos: {}, tipo: '' });

  // --- PERSISTENCIA ---
  useEffect(() => {
    localStorage.setItem('cat_ajustes', JSON.stringify(datos));
    localStorage.setItem('cat_prods', JSON.stringify(productos));
    localStorage.setItem('cat_banners', JSON.stringify(bannersManuales));
  }, [datos, productos, bannersManuales]);

  // --- LOGICA EDITORES ---
  const abrirEditor = (id, info, tipo) => {
    // Usamos el helper si es banner, sino clonamos el producto
    const datosParaElModal = tipo === 'banner' 
      ? prepararDatosBanner(info) 
      : { ...info };

    setTempEditor({ 
      id, 
      datos: datosParaElModal, 
      tipo 
    });
  
    setShowModal(true); 
  };

  const guardarCambios = () => {
    if (tempEditor.tipo === 'producto') {
      const nuevos = [...productos];
      // Si el ID es mayor o igual al largo, es un producto nuevo (push)
      if (tempEditor.id >= nuevos.length) {
        nuevos.push(tempEditor.datos);
      } else {
        nuevos[tempEditor.id] = tempEditor.datos;
      }
      setProductos(nuevos);
    } else {
      // PARA BANNERS:
      // Guardamos directamente el array que viene del modal
      setBannersManuales({ 
        ...bannersManuales, 
        [tempEditor.id]: tempEditor.datos 
      });
    }
    setShowModal(false);
  };

  return (
    <div className="app-container">
      <PanelControl 
        datos={datos} 
        setDatos={setDatos} 
        setProductos={setProductos} 
        abrirEditor={abrirEditor}
        totalProds={productos.length}
      />

      <main className="main-preview-area">
        <VistaHojaA4 
          productos={productos} 
          datos={datos} 
          bannersManuales={bannersManuales} 
          abrirEditor={abrirEditor} 
        />
      </main>

      <ModalesContainer 
        showEditor={showModal} 
        onHideEditor={() => setShowModal(false)}
        tempEditor={tempEditor} 
        setTempEditor={setTempEditor}
        guardarCambios={guardarCambios} 
        eliminarProducto={(idx) => { setProductos(productos.filter((_, i) => i !== idx)); setShowModal(false); }}
      />
    </div>
  );
}

export default App;
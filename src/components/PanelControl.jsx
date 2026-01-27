import React, { useState } from 'react';
import { procesarArchivoExcel } from '../services/dataHandler';
import '../styles/panelControl.css';

const PanelControl = ({ datos, setDatos, setProductos, abrirEditor, totalProds, resetearTodo }) => {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const nuevosProductos = await procesarArchivoExcel(file);
      // Agregamos IDs únicos a los productos importados para que sean editables
      const productosConId = nuevosProductos.map((p, i) => ({
        ...p,
        id: Date.now() + i
      }));
      setProductos(productosConId);
      e.target.value = null; 
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const handleLogoUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setDatos({ ...datos, logoUrl: e.target.result });
    reader.readAsDataURL(file);
  };

  const esLogoLocal = datos.logoUrl?.startsWith('data:');

  return (
    <aside className="panel-control no-print">
      <div className="panel-header">
        <h2>CATÁLOGO PRO</h2>
        <span className="badge-count">{totalProds} Productos</span>
      </div>

      {/* SECCIÓN LOGO */}
      <div className="panel-section">
        <label className="section-title">LOGO DE EMPRESA</label>
        <div 
          className={`logo-upload-area ${datos.logoUrl ? 'has-logo' : ''} ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleLogoUpload(e.dataTransfer.files[0]);
          }}
          onClick={() => !datos.logoUrl && document.getElementById('logoInput').click()}
        >
          {datos.logoUrl ? (
            <div className="preview-container">
              <img src={datos.logoUrl} alt="Logo" className="logo-preview-thumb" />
              <button className="btn-clear-logo" onClick={(e) => {
                e.stopPropagation();
                setDatos({...datos, logoUrl: ''});
              }}>×</button>
            </div>
          ) : (
            <div className="upload-placeholder"><span>+ Logo</span></div>
          )}
          <input id="logoInput" type="file" accept="image/*" hidden onChange={(e) => handleLogoUpload(e.target.files[0])} />
        </div>
        <input 
          type="text" className="input-url-logo"
          placeholder={esLogoLocal ? "Imagen local cargada" : "O pega URL del logo..."}
          value={esLogoLocal ? "" : datos.logoUrl}
          disabled={esLogoLocal}
          onChange={(e) => setDatos({...datos, logoUrl: e.target.value})}
        />
      </div>

      {/* SECCIÓN DATOS */}
      <div className="panel-section">
        <label className="section-title">DATOS DE EMPRESA</label>
        <input type="text" placeholder="Nombre" value={datos.nombre} onChange={(e) => setDatos({...datos, nombre: e.target.value})} />
        <input type="text" placeholder="Dirección" value={datos.dir} onChange={(e) => setDatos({...datos, dir: e.target.value})} />
        <input type="text" placeholder="WhatsApp" value={datos.tel} onChange={(e) => setDatos({...datos, tel: e.target.value})} />
      </div>

      {/* SECCIÓN ACCIONES */}
      <div className="panel-section">
        <label className="section-title">ACCIONES</label>
        <div className="file-input-wrapper">
          <button className="btn-action btn-import">IMPORTAR EXCEL</button>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </div>

        <button 
          className="btn-action btn-add"
          onClick={() => {
            // Clave: Usar un ID que no exista (timestamp)
            const idUnico = Date.now();
            abrirEditor(idUnico, { 
              nombre: '', precioLista: 0, tipoPack: 'PACK', cantidad: 1, unidad: 'UDS', tipoOferta: 'ninguna' 
            }, 'producto');
          }}
        >
          AGREGAR PRODUCTO +
        </button>

        <button className="btn-action btn-print" onClick={() => window.print()}>
          IMPRIMIR / PDF
        </button>
      </div>

      <div className="panel-footer">
        <button 
          className="btn-reset" 
          onClick={() => abrirEditor('clear-catalog', {}, 'limpiar')}
        >
          Limpiar Catálogo
        </button>
      </div>
    </aside>
  );
};

export default PanelControl;
import React, { useState } from 'react';
import { procesarArchivoExcel } from '../services/dataHandler';
import '../styles/panelControl.css';

const PanelControl = ({ datos, setDatos, setProductos, abrirEditor, totalProds, resetearTodo }) => {
  const [dragging, setDragging] = useState(false);

  // --- Lógica para Importar Excel ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const nuevosProductos = await procesarArchivoExcel(file);
      setProductos(nuevosProductos);
      e.target.value = null; 
    } catch (error) {
      alert("Error al procesar Excel: " + error);
    }
  };

  // --- Lógica para Logo (Local y URL) ---
  const handleLogoUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert("Por favor, sube un archivo de imagen válido.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setDatos({ ...datos, logoUrl: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = (e) => {
    e.stopPropagation();
    setDatos({ ...datos, logoUrl: '' });
  };

  // --- Manejadores de Drag & Drop ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragging(true);
    else if (e.type === "dragleave") setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoUpload(file);
  };

  // Determinar si el logo actual es un archivo local (Base64)
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
          className={`logo-upload-area ${dragging ? 'dragging' : ''} ${datos.logoUrl ? 'has-logo' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !datos.logoUrl && document.getElementById('logoInput').click()}
        >
          {datos.logoUrl ? (
            <div className="preview-container">
              <img src={datos.logoUrl} alt="Logo preview" className="logo-preview-thumb" />
              <button className="btn-clear-logo" onClick={clearLogo}>×</button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <span>+ Arrastrar Logo</span>
              <small>o clic para buscar</small>
            </div>
          )}
          <input 
            id="logoInput"
            type="file" 
            accept="image/*" 
            hidden 
            onChange={(e) => handleLogoUpload(e.target.files[0])} 
          />
        </div>

        <input 
          type="text" 
          className="input-url-logo"
          placeholder={esLogoLocal ? "Imagen local cargada" : "O pega URL del logo..."}
          value={esLogoLocal ? "" : datos.logoUrl}
          disabled={esLogoLocal}
          onChange={(e) => setDatos({...datos, logoUrl: e.target.value})}
        />
      </div>

      {/* SECCIÓN DATOS */}
      <div className="panel-section">
        <label className="section-title">DATOS DE EMPRESA</label>
        <input 
          type="text" 
          placeholder="Nombre de Empresa"
          value={datos.nombre}
          onChange={(e) => setDatos({...datos, nombre: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Dirección / Localidad"
          value={datos.dir}
          onChange={(e) => setDatos({...datos, dir: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Teléfono / WhatsApp"
          value={datos.tel}
          onChange={(e) => setDatos({...datos, tel: e.target.value})}
        />
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
          onClick={() => abrirEditor(totalProds, { nombre: '', precioLista: '', tipoPack: 'CAJA', cantidad: '1', unidad: 'UDS.' }, 'producto')}
        >
          AGREGAR PRODUCTO +
        </button>

        <button 
          className="btn-action btn-print"
          onClick={() => window.print()}
        >
          IMPRIMIR / PDF
        </button>
      </div>

      <div className="panel-footer">
        <button className="btn-reset" onClick={resetearTodo}>
          Limpiar Catálogo
        </button>
      </div>
    </aside>
  );
};

export default PanelControl;
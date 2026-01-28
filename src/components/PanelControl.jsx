import React, { useState } from 'react';
import { procesarArchivoExcel } from '../services/dataHandler';
import '../styles/panelControl.css';

const PanelControl = ({ 
  datos, setDatos, 
  setProductos, 
  abrirEditor, 
  totalProds, 
  columnas, setColumnas, 
  filasPorHoja, setFilasPorHoja,
  tipoHoja, setTipoHoja,
  medidaCustom, setMedidaCustom
}) => {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const nuevosProductos = await procesarArchivoExcel(file);
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
        <input 
          type="text" 
          placeholder="Nombre" 
          value={datos.nombre} 
          onChange={(e) => setDatos({...datos, nombre: e.target.value})} 
        />
        <div className="form-check form-switch mb-3 mt-1 d-flex align-items-center">
          <input 
            className="form-check-input me-2" 
            type="checkbox" 
            id="switchMostrarNombre"
            style={{ cursor: 'pointer' }}
            checked={datos.mostrarNombre !== false}
            onChange={(e) => setDatos({...datos, mostrarNombre: e.target.checked})}
          />
          <label className="form-check-label small text-muted" htmlFor="switchMostrarNombre" style={{ cursor: 'pointer', fontSize: '15px', color: 'white' }}>
            Mostrar nombre en cabecera
          </label>
        </div>
        <input 
          type="text" 
          placeholder="Dirección" 
          value={datos.dir} 
          onChange={(e) => setDatos({...datos, dir: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="WhatsApp" 
          value={datos.tel} 
          onChange={(e) => setDatos({...datos, tel: e.target.value})} 
        />
      </div>      

      {/* SECCIÓN CONFIGURACIÓN DE PÁGINA */}
      <div className="panel-section">
        <label className="section-title">DISEÑO DE PÁGINA</label>
        
        {/* Selector de Formato */}
        <div className="control-item mb-3">
          <label className="small text-muted mb-1">Formato de Hoja</label>
          <select 
            className="form-select form-select-sm" 
            value={tipoHoja} 
            onChange={(e) => setTipoHoja(e.target.value)}
          >
            <option value="A4">A4 (Estándar)</option>
            <option value="OFICIO">Oficio / Legal</option>
            <option value="A5">A5 (Folleto)</option>
            <option value="CUSTOM">Personalizado</option>
          </select>
        </div>

        {/* Inputs para medida Custom */}
        {tipoHoja === 'CUSTOM' && (
          <div className="d-flex gap-2 mb-3 align-items-end" style={{animation: 'fadeIn 0.3s'}}>
            <div className="flex-fill">
              <label style={{fontSize: '9px', color: '#888'}}>Ancho mm</label>
              <input 
                type="number" className="form-control form-control-sm"
                value={medidaCustom.ancho}
                onChange={(e) => setMedidaCustom({...medidaCustom, ancho: Number(e.target.value)})}
              />
            </div>
            <div className="flex-fill">
              <label style={{fontSize: '9px', color: '#888'}}>Alto mm</label>
              <input 
                type="number" className="form-control form-control-sm"
                value={medidaCustom.alto}
                onChange={(e) => setMedidaCustom({...medidaCustom, alto: Number(e.target.value)})}
              />
            </div>
          </div>
        )}

        <div className="control-item mb-2">
          <div className="d-flex justify-content-between">
            <label className="small text-muted">Columnas</label>
            <span className="fw-bold text-primary">{columnas}</span>
          </div>
          <input 
            type="range" className="form-range" min="3" max="6" 
            value={columnas} onChange={(e) => setColumnas(Number(e.target.value))} 
          />
        </div>

        <div className="control-item">
          <div className="d-flex justify-content-between">
            <label className="small text-muted">Filas por Hoja</label>
            <span className="fw-bold text-primary">{filasPorHoja}</span>
          </div>
          <input 
            type="range" className="form-range" min="1" max="5" 
            value={filasPorHoja} onChange={(e) => setFilasPorHoja(Number(e.target.value))} 
          />
        </div>
        
        <div className="info-badge-panel mt-2 text-center small py-1 bg-light border rounded text-muted">
          {columnas * filasPorHoja} productos por carilla
        </div>
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
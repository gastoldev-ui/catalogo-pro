import * as XLSX from 'xlsx';

export const procesarArchivoExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const productosFormateados = data.map((item) => {
          // Detectamos el tipo de oferta para mapear los valores correctamente
          const tipo = (item.TipoOferta || '').toLowerCase();
          
          return {
            nombre: (item.Nombre || item.Articulo || '').toUpperCase(),
            precioLista: item.PrecioLista || item.Precio || '0',
            
            // Lógica de Ofertas
            tipoOferta: tipo || 'directa', 
            ofertaDirecta: tipo === 'directa' ? (item.ValorOferta || item.PrecioOferta) : '',
            promoCant: tipo === 'cantidad' ? (item.PromoCant || item.Lleva || '') : '',
            promoPrecio: tipo === 'cantidad' ? (item.ValorOferta || item.Paga || '') : '',
            lleva: tipo === 'bonificado' ? (item.Lleva || '') : '',
            paga: tipo === 'bonificado' ? (item.Paga || item.ValorOferta || '') : '',

            foto: item.Foto || item.Imagen || '',
            cod: item.Codigo || item.ID || '',
            tipoPack: (item.TipoPack || item.Pack || 'CAJA').toUpperCase(),
            cantidad: item.Cantidad || item.Bulto || '1',
            unidad: (item.Unidad || 'UDS.').toUpperCase(),
            banner: item.Banner || item.Categoria || ''
          };
        });

        resolve(productosFormateados);
      } catch (error) {
        reject("Error al procesar el Excel. Verifica el formato.");
      }
    };

    reader.onerror = () => reject("Error al leer el archivo.");
    reader.readAsBinaryString(file);
  });
};
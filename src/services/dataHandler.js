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
          // Limpieza básica: removemos espacios extra y normalizamos a minúsculas
          const tipo = String(item.tipoOferta || item.TipoOferta || 'ninguna').trim().toLowerCase();
          
          return {
            // Normalizamos nombres
            nombre: String(item.nombre || item.Nombre || item.Articulo || '').trim().toUpperCase(),
            cod: String(item.cod || item.Codigo || item.ID || '').trim(),
            
            // Forzamos que los números sean números o '0', nunca undefined
            precioLista: Number(item.precioLista || item.PrecioLista || item.Precio) || 0,
            
            // Mapeo inteligente de ofertas
            tipoOferta: tipo, 
            ofertaDirecta: tipo === 'directa' ? (Number(item.ofertaDirecta || item.ValorOferta || item.PrecioOferta) || 0) : '',
            
            promoCant: tipo === 'cantidad' ? (Number(item.promoCant || item.PromoCant || item.Lleva) || 0) : '',
            promoPrecio: tipo === 'cantidad' ? (Number(item.promoPrecio || item.ValorOferta || item.Paga) || 0) : '',
            
            lleva: tipo === 'bonificado' ? (Number(item.lleva || item.Lleva) || 0) : '',
            paga: tipo === 'bonificado' ? (Number(item.paga || item.Paga || item.ValorOferta) || 0) : '',

            // Resto de campos
            foto: item.foto || item.Foto || item.Imagen || '',
            tipoPack: String(item.tipoPack || item.TipoPack || item.Pack || 'PACK').toUpperCase().trim(),
            cantidad: Number(item.cantidad || item.Cantidad || item.Bulto) || 1,
            unidad: String(item.unidad || item.Unidad || 'UDS').toUpperCase().trim(),
          };
        });

        resolve(productosFormateados);
      } catch (error) {
        console.error("Error detalle:", error);
        reject("Error al procesar el Excel. Verifica que las columnas coincidan.");
      }
    };

    reader.onerror = () => reject("Error al leer el archivo.");
    reader.readAsBinaryString(file);
  });
};
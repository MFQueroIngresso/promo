import * as React from 'react';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';
import DescriptionIcon from '@mui/icons-material/Description';

const ExportExcelDetalhados = ({ data, columnHeaders }) => {
  const handleDownload = () => {
    // Formatando os dados para a planilha Excel
    const formattedData = data.map(row => [
      row.data_compra,
      row.pdv,
      row.pos,
      row.pedido,
      row.cod_barras,
      row.situacao,
      row.ing,
      row.ing_num,
      row.valor,
      row.pagamento,
      row.cod_pagseguro
    ]);

    // Criando uma planilha Excel
    const ws = XLSX.utils.aoa_to_sheet([columnHeaders, ...formattedData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detalhados');

    // Calculando largura máxima para cada coluna
    const columnWidths = formattedData[0].map((col, i) => ({
      wch: Math.max(...formattedData.map(row => row[i]?.toString().length || 0)) + 2,
    }));

    // Aplicando larguras calculadas
    ws['!cols'] = columnWidths;

    // Salvando a planilha como um arquivo Excel
    XLSX.writeFile(wb, 'detalhados.xlsx');
  };

  return (
    <Button component="label" variant="contained" color='success' onClick={handleDownload} startIcon={<DescriptionIcon />}>
      Exportar Excel
    </Button>
  );
}

export default ExportExcelDetalhados;

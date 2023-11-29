import * as React from 'react';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';
import DescriptionIcon from '@mui/icons-material/Description';

const ExportExcelSite = ({ data, columnHeaders }) => {
  const handleDownload = () => {
    // Formatando os dados para a planilha Excel
    const formattedData = data.map(row => [
      row.pedido,
      row.data,
      row.status,
      row.comprador,
      row.nominado,
      row.email,
      row.telefone,
      row.quant,
      row.ingressos,
      row.valor
    ]);

    // Criando uma planilha Excel
    const ws = XLSX.utils.aoa_to_sheet([columnHeaders, ...formattedData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Site');

    // Adicionando formatação condicional para linhas zebradas
    for (let i = 1; i <= formattedData.length; i++) {
      const style = i % 2 === 0 ? { fill: { bgColor: { indexed: 9 } } } : {}; // Cor de fundo para linhas pares
      Object.keys(style).forEach(key => {
        const cellAddress = XLSX.utils.encode_cell({ r: i, c: 0 });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress][key] = style[key];
      });
    }

    // Calculando largura máxima para cada coluna
    const columnWidths = formattedData[0].map((col, i) => ({
      wch: Math.max(...formattedData.map(row => row[i]?.toString().length || 0)) + 2,
    }));

    // Aplicando larguras calculadas
    ws['!cols'] = columnWidths;

    // Salvando a planilha como um arquivo Excel
    XLSX.writeFile(wb, 'site_detalhados.xlsx');
  };

  return (
    <Button component="label" variant="contained" color='success' onClick={handleDownload} startIcon={<DescriptionIcon />}>
      Exportar Excel
    </Button>
  );
}

export default ExportExcelSite;

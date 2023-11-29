import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Connection from '../../../model';
import { Box, Typography } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import Pagination from '@mui/material/Pagination';

export default function Ranking() {
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dataLoaded, setDataLoaded] = useState(false); //estado para controlar se os dados foram carregados ou não
  const [rankingMetrics, setRanking] = useState([]); //estado para salvar os dados retornados pelo endpoint 
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePagination = (event, value) => {
    setCurrentPage(value);
    setPage(value - 1);
  };

  //recupera e salva os dados do localStorage para preencher dados salvos no login
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON);

  const handleRequestSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    if (selectedEventCode && !dataLoaded) {
      const conn = Connection(); //conecta com o servidor backend

      const fetchRanking = async () => {
        try {
          const response = await conn.get(
            'metrics/pdvs?evento=' + selectedEventCode.eve_cod, //faz a requisição na rota especificada
            {
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          );

          if (response.status === 200) {
            setRanking(response.data);
            setDataLoaded(true);
          } else {
            console.log('Erro na resposta da API:', response);
          }
        } catch (error) {
          console.error('Erro na solicitação GET:', error);
        }
      };
      fetchRanking();
    }
  }, [selectedEventCode, dataLoaded]);

  //console.log('ranking:' + rankingMetrics)

  const ranking = rankingMetrics.map(item => ({
    nome: item.nome,
    quant: item.quant,
    valor: item.valor,
    quant_hoje: item.quant_hoje,
    valor_hoje: item.valor_hoje,
    perc: item.perc
  }))

  //console.log('ranking:' + ranking.nome)

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, ranking.length - page * rowsPerPage);

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  return (
    <Box sx={{ width: '100%', ml: 1 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Typography
          sx={{ flex: '1 1 100%', mt: 10 }}
          variant="h6"
          id="tableTitle"
          component="div"
          fontSize="14px"
          fontWeight="bold"
        >
          Ranking de PDVs (Com movimentação)
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'nome'}
                    direction={orderBy === 'nome' ? order : 'asc'}
                    onClick={handleRequestSort('nome')}
                  >
                    <strong>PDV</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'quant_hoje'}
                    direction={orderBy === 'quant_hoje' ? order : 'asc'}
                    onClick={handleRequestSort('quant_hoje')}
                  >
                    <strong>Hoje (Qtde)</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'valor_hoje'}
                    direction={orderBy === 'valor_hoje' ? order : 'asc'}
                    onClick={handleRequestSort('valor_hoje')}
                  >
                    <strong>Hoje (Valor)</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'quant'}
                    direction={orderBy === 'quant' ? order : 'asc'}
                    onClick={handleRequestSort('quant')}
                  >
                    <strong>Total (Qtde)</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'valor'}
                    direction={orderBy === 'valor' ? order : 'asc'}
                    onClick={handleRequestSort('valor')}
                  >
                    <strong>Total (Valor)</strong>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? stableSort(ranking, (a, b) => {
                  const isAsc = order === 'asc';
                  return isAsc ? (a[orderBy] > b[orderBy] ? 1 : -1) : (b[orderBy] > a[orderBy] ? 1 : -1);
                }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : ranking
              ).map((row) => (
                <TableRow key={row.nome}>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell align='center'>{row.nome}</TableCell>
                  <TableCell align='center'>{row.quant_hoje}</TableCell>
                  <TableCell align='center'>{row.valor_hoje}</TableCell>
                  <TableCell align='center'>{row.quant}</TableCell>
                  <TableCell align='center'>{row.valor}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(ranking.length / rowsPerPage)} // Calcula o número total de páginas
          page={currentPage}
          onChange={handleChangePagination}
          showFirstButton
          showLastButton
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}
        />
      </Paper>
    </Box>
  );
}

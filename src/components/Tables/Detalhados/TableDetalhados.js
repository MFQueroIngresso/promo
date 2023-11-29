import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Connection from '../../../model';
import { CircularProgress, Container, Divider, Grid } from '@mui/material';
import DownloadButton from '../../Buttons/DownloadButton';
import FilterButtonTipo from '../../Buttons/FilterButtonTipo';
import FilterButtonSituacao from '../../Buttons/FilterButtonSituacao';
import FilterButtonPos from '../../Buttons/FilterButtonPos';
import FilterButtonPdv from '../../Buttons/FilterButtonPdv';
import SearchBar from '../../Outros/SearchBar';
import TableSortLabel from '@mui/material/TableSortLabel';
import { format } from 'date-fns';
import Pagination from '@mui/material/Pagination';
import ExportExcelDetalhados from '../../Buttons/ExportExcelDetalhados';

export default function TableDetalhados() {
  const [orderBy, setOrderBy] = useState('data_compra');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dataLoaded, setDataLoaded] = useState(false); //estado para controlar se os dados foram carregados ou não
  const [dataLoadedFiltros, setDataLoadedFiltros] = useState(false); //estado para controlar se os dados foram carregados ou não
  const [detalhes, setDetalhes] = useState([]); //estado para salvar os dados retornados pelo endpoint
  const [filtros, setFiltros] = useState([]); //estado para salvar os dados retornados pelo endpoint
  const [pdvFilter, setPdvFilter] = useState(''); // Estado para armazenar o valor selecionado no FilterButtonPdv
  const [posFilter, setPosFilter] = useState(''); // Estado para armazenar o valor selecionado no FilterButtonPos
  const [situacaoFilter, setSituacaoFilter] = useState(''); // Estado para armazenar o valor selecionado no FilterButtonSituacao
  const [tipoFilter, setTipoFilter] = useState(''); // Estado para armazenar o valor selecionado no FilterButtonTipo
  const [searchQuery, setSearchQuery] = useState(''); // Busca
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePagination = (event, value) => {
    setCurrentPage(value);
    setPage(value - 1);
  };

  //recupera e salva os dados do localStorage para preencher dados salvos no login
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON);

  const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      '&:nth-of-type(2)': {
        minWidth: '150px',
      },
      '&:nth-of-type(3)': {
        minWidth: '200px',
      },
      '&:nth-of-type(4)': {
        minWidth: '150px',
      },
      '&:nth-of-type(5)': {
        minWidth: '150px',
      },
      '&:nth-of-type(6)': {
        minWidth: '200px',
      },
      '&:nth-of-type(7)': {
        minWidth: '100px',
      },
      '&:nth-of-type(8)': {
        minWidth: '150px',
      },
      '&:nth-of-type(9)': {
        minWidth: '150px',
      },
      '&:nth-of-type(10)': {
        minWidth: '150px',
      },
      '&:nth-of-type(11)': {
        minWidth: '200px',
      },
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      textAlign: 'center',
      '&:nth-of-type(7)': {
        minWidth: '100px',
        textAlign: 'left'
      },
      '&:nth-of-type(9)': {
        minWidth: '100px',
        textAlign: 'left'
      },
    },
  }));

  const StyledTableBodyRow = styled(TableRow)(({ theme, index }) => ({
    backgroundColor: theme.palette.mode === 'light' ? (index % 2 === 0 ? 'white' : '#f5f5f5') : '',
  }));

  const handleRequestSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const columnHeaders = [
    'Data da Compra',
    'PDV',
    'POS',
    'Número do Pedido',
    'Código de Barras',
    'Situação',
    'Ingresso',
    'Ingresso Numerado',
    'Valor',
    'Forma de Pagamento',
    'Cód. da Transação',
  ];

  //requisição dos dados detalhados
  useEffect(() => {
    if (selectedEventCode && !dataLoaded) {
      const conn = Connection(); //conecta com o servidor backend

      const fetchDetalhes = async () => {
        try {
          const response = await conn.post(
            'eventos/detalhados', //faz a requisição na rota especificada
            {
              evento: selectedEventCode.eve_cod, //passa o id do evento
              filtros: {
                pdv: pdvFilter,
                pos: posFilter,
                situacao: situacaoFilter,
                tipo: tipoFilter
              },
              busca: searchQuery
            },
            {
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          );

          if (response.status === 200) {
            setDetalhes(response.data.data);
            setDataLoaded(true);
          } else {
            console.log('Erro na resposta da API:', response);
          }
        } catch (error) {
          console.error('Erro na solicitação GET:', error);
        }
      };
      fetchDetalhes();
    }
  }, [selectedEventCode, dataLoaded, pdvFilter, posFilter, situacaoFilter, tipoFilter]);

  //requisição dos filtros
  useEffect(() => {
    if (selectedEventCode && !dataLoadedFiltros) {
      const conn = Connection(); //conecta com o servidor backend

      const fetchFiltros = async () => {
        try {
          const response = await conn.get(
            'eventos/detalhados/filtros?evento=' + selectedEventCode.eve_cod, //faz a requisição na rota especificada
            {
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          );

          if (response.status === 200) {
            setFiltros(response.data);
            setDataLoadedFiltros(true);
          } else {
            console.log('Erro na resposta da API:', response);
          }
        } catch (error) {
          console.error('Erro na solicitação GET:', error);
        }
      };
      fetchFiltros();
    }
  }, [selectedEventCode, dataLoadedFiltros]);

  //console.log(filtros)

  const handleSearch = (query) => {
    const searchQuery = query.trim() === '' ? '' : query;
    setSearchQuery(searchQuery);
    setPage(0);
    setDataLoaded(false);
  };

  const handlePdvFilterChange = (value) => {
    setPdvFilter(value); // Atualiza o estado pdvFilter com a opção selecionada
    setDataLoaded(false);
  };

  const handlePosFilterChange = (value) => {
    setPosFilter(value); // Atualiza o estado posFilter com a opção selecionada
    setDataLoaded(false);
  };

  const handleSituacaoFilterChange = (value) => {
    setSituacaoFilter(value); // Atualiza o estado situacaoFilter com a opção selecionada
    setDataLoaded(false);
  };

  const handleTipoFilterChange = (value) => {
    setTipoFilter(value); // Atualiza o estado tipoFilter com a opção selecionada
    setDataLoaded(false);
  };

  //console.log(detalhes)
  console.log(situacaoFilter)

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, detalhes.length - page * rowsPerPage);

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
    <React.Fragment>
      <Container maxWidth="lg" sx={{ m: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: 2 }}>
        <div>
          {dataLoaded && dataLoadedFiltros ? (
            <div>
              <Grid container spacing={3} sx={{ py: 2, flexWrap: 'wrap' }}>
                <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                  <SearchBar label="Buscar PDV ou POS" onSearch={handleSearch} />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                  <FilterButtonPdv
                    pdvOptions={filtros.pdv.map((filtro) => ({
                      value: filtro,
                      label: filtro,
                    }))}
                    selectedPdv={pdvFilter}
                    onPdvFilterChange={handlePdvFilterChange}
                  />
                  <FilterButtonPos
                    posOptions={filtros.pos.map((filtro) => ({
                      value: filtro,
                      label: filtro,
                    }))}
                    selectedPos={posFilter}
                    onPosFilterChange={handlePosFilterChange}
                  />
                  <FilterButtonSituacao
                    situacaoOptions={filtros.situacao.map((filtro) => ({
                      value: filtro,
                      label: filtro,
                    }))}
                    selectedSituacao={situacaoFilter}
                    onSituacaoFilterChange={handleSituacaoFilterChange}
                  />
                  <FilterButtonTipo
                    tipoOptions={filtros.tipo.map((filtro) => ({
                      value: filtro,
                      label: filtro,
                    }))}
                    selectedTipo={tipoFilter}
                    onTipoFilterChange={handleTipoFilterChange}
                  />
                  <DownloadButton />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1, mx: -2, backgroundColor: 'var(--grey-shadow)' }} />
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <TableCell align='center'></TableCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'data_compra'}
                              direction={orderBy === 'data_compra' ? order : 'asc'}
                              onClick={handleRequestSort('data_compra')}
                            >
                              <strong>Data da Compra</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'pdv'}
                              direction={orderBy === 'pdv' ? order : 'asc'}
                              onClick={handleRequestSort('pdv')}
                            >
                              <strong>Pdv</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'pos'}
                              direction={orderBy === 'pos' ? order : 'asc'}
                              onClick={handleRequestSort('pos')}
                            >
                              <strong>Pos</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'numero_pedido'}
                              direction={orderBy === 'numero_pedido' ? order : 'asc'}
                              onClick={handleRequestSort('numero_pedido')}
                            >
                              <strong>Número do Pedido</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'codigo_barras'}
                              direction={orderBy === 'codigo_barras' ? order : 'asc'}
                              onClick={handleRequestSort('codigo_barras')}
                            >
                              <strong>Código de Barras</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'situacao'}
                              direction={orderBy === 'situacao' ? order : 'asc'}
                              onClick={handleRequestSort('situacao')}
                            >
                              <strong>Situação</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='left'>
                            <TableSortLabel
                              active={orderBy === 'ingresso'}
                              direction={orderBy === 'ingresso' ? order : 'asc'}
                              onClick={handleRequestSort('ingresso')}
                            >
                              <strong>Ingresso</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'ingresso_numerado'}
                              direction={orderBy === 'ingresso_numerado' ? order : 'asc'}
                              onClick={handleRequestSort('ingresso_numerado')}
                            >
                              <strong>Ingresso Numerado</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='left'>
                            <TableSortLabel
                              active={orderBy === 'valor'}
                              direction={orderBy === 'valor' ? order : 'asc'}
                              onClick={handleRequestSort('valor')}
                            >
                              <strong>Valor</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'forma_pagamento'}
                              direction={orderBy === 'forma_pagamento' ? order : 'asc'}
                              onClick={handleRequestSort('forma_pagamento')}
                            >
                              <strong>Forma de Pagamento</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align='center'>
                            <TableSortLabel
                              active={orderBy === 'cod_transacao'}
                              direction={orderBy === 'cod_transacao' ? order : 'asc'}
                              onClick={handleRequestSort('cod_transacao')}
                            >
                              <strong>Cód. da Transação</strong>
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0
                          ? stableSort(detalhes, (a, b) => {
                            const isAsc = order === 'asc';
                            return isAsc ? (a[orderBy] > b[orderBy] ? 1 : -1) : (b[orderBy] > a[orderBy] ? 1 : -1);
                          }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          : detalhes
                        ).map((row, index) => (
                          <StyledTableBodyRow key={row.tipo} index={index}>
                            <TableCell component="th" scope="row" align='center'></TableCell>
                            <TableCell component="th" scope="row" align='center'>
                              {format(new Date(row.data_compra), 'dd/MM/yyyy HH:mm')}
                            </TableCell>
                            <TableCell align='center'>{row.pdv}</TableCell>
                            <TableCell align='center'>{row.pos}</TableCell>
                            <TableCell align='center'>{row.pedido}</TableCell>
                            <TableCell align='center'>{row.cod_barras}</TableCell>
                            <TableCell align='center'>{row.situacao}</TableCell>
                            <TableCell align='left'>{row.ing}</TableCell>
                            <TableCell align='center'>{row.ing_num}</TableCell>
                            <TableCell align='left'>{row.valor}</TableCell>
                            <TableCell align='center'>{row.pagamento}</TableCell>
                            <TableCell align='center'>{row.cod_pagseguro}</TableCell>
                          </StyledTableBodyRow>
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
                    count={Math.ceil(detalhes.length / rowsPerPage)} // Calcula o número total de páginas
                    page={currentPage}
                    onChange={handleChangePagination}
                    showFirstButton
                    showLastButton
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}
                  />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
                  <ExportExcelDetalhados data={detalhes} columnHeaders={columnHeaders}/>
                </Grid>
              </Grid>
            </div>
          ) : (
            // Renderizar um indicador de carregamento enquanto os dados são buscados
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
            </div>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
}
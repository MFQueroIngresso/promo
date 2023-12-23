import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress, Container, Divider, Grid } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import Connection from '../../../model';
import { format } from 'date-fns';
import SearchBar from '../../Outros/SearchBar';
import FilterButtonStatus from '../../Buttons/FilterButtonStatus';
import FilterButtonIngresso from '../../Buttons/FilterButtonIngresso';
import ExportExcelSite from '../../Buttons/ExportExcelSite';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bold',
    textAlign: 'center',
    '&:nth-of-type(1)': {
      minWidth: '150px',
    },
    '&:nth-of-type(2)': {
      minWidth: '100px',
    },
    '&:nth-of-type(3)': {
      minWidth: '100px',
    },
    '&:nth-of-type(4)': {
      minWidth: '200px',
    },
    '&:nth-of-type(5)': {
      minWidth: '200px',
    },
    '&:nth-of-type(9)': {
      minWidth: '150px',
      textAlign: 'left'
    },
    '&:nth-of-type(10)': {
      minWidth: '100px',
      textAlign: 'left'
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: 'center',
    '&:nth-of-type(9)': {
      minWidth: '200px',
      textAlign: 'left'
    },
    '&:nth-of-type(10)': {
      minWidth: '100px',
      textAlign: 'left'
    },
  },
}));

const StyledTableBodyRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: theme.palette.mode === 'light' ? (index % 2 === 0 ? 'white' : '#f5f5f5') : '',
}));

export default function TableSite() {
  const [orderBy, setOrderBy] = useState('data'); // Defina a coluna padrão para ordenar
  const [order, setOrder] = useState('desc'); // Defina a ordem padrão para ordenar
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState();
  const [dataLoaded, setDataLoaded] = useState(false); //estado para controlar se os dados foram carregados ou não
  const [site, setSite] = useState([]); //estado para salvar os dados retornados pelo endpoint
  const [dataLoadedStatus, setDataLoadedStatus] = React.useState(false); //estado para controlar se os dados foram carregados ou não
  const [dataLoadedIngresso, setDataLoadedIngresso] = React.useState(false); //estado para controlar se os dados foram carregados ou não
  const [filtroStatus, setFiltroStatus] = React.useState([]); //estado para salvar os dados retornados pelo endpoint
  const [filtroIngresso, setFiltroIngresso] = React.useState([]); //estado para salvar os dados retornados pelo endpoint
  const [statusFilter, setStatusFilter] = useState(''); // Estado para armazenar o valor selecionado no FilterButtonStatus
  const [ingressoFilter, setIngressoFilter] = useState(''); // Estado para armazenar o valor selecionado no FilterButtonIngresso
  const [searchQuery, setSearchQuery] = useState(''); // Busca

  //recupera e salva os dados do localStorage para preencher dados salvos no login
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON);

  const columnHeaders = [
    'Pedido',
    'Data',
    'Status',
    'Comprador',
    'Nominado',
    'E-mail',
    'Telefone',
    'Quantidade',
    'Ingresso',
    'Valor'
  ];

  const conn = Connection(); //conecta com o servidor backend
  const fetchSite = async (page) => {
    try {
      const response = await conn.post(
        'eventos/site', //faz a requisição na rota especificada
        {
          cat: selectedEventCode.categoria, //passa a categoria do evento
          filtros: {
            status: statusFilter,
            ingresso: ingressoFilter
          },
          busca: searchQuery,
          linhas: 10,
          pagina: page
        },
        {
          headers: {
            'token': localStorage.getItem('token')
          }
        }
      );

      if (response.status === 200) {
        setSite(response.data.ingressos);
        setData(response.data)
        setTotalPages(response.data.total)
        setDataLoaded(true);
      } else {
        console.log('Erro na resposta da API:', response);
      }
    } catch (error) {
      console.error('Erro na solicitação POST:', error);
    }
  };

  useEffect(() => {
    if (selectedEventCode && !dataLoaded) {
      fetchSite(page);
    }
  }, [selectedEventCode, dataLoaded, statusFilter, ingressoFilter]);

  //console.log(selectedEventCode.categoria)
  //console.log(site)

  //requisição get dos filtros de status
  React.useEffect(() => {
    if (selectedEventCode && !dataLoadedStatus) {
      const conn = Connection(); //conecta com o servidor backend

      const fetchFiltroStatus = async () => {
        try {
          const response = await conn.get(
            `eventos/site/filtros?cat=${selectedEventCode.categoria}`, //faz a requisição na rota especificada
            {
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          );

          if (response.status === 200) {
            setFiltroStatus(response.data.status);
            setDataLoadedStatus(true);
          } else {
            console.log('Erro na resposta da API:', response);
          }
        } catch (error) {
          console.error('Erro na solicitação GET:', error);
        }
      };
      fetchFiltroStatus();
    }
  }, [selectedEventCode, dataLoadedStatus]);

  //console.log(selectedEventCode.categoria)
  //console.log(filtroStatus)

  //requisição get dos filtros de ingresso
  React.useEffect(() => {
    if (selectedEventCode && !dataLoadedIngresso) {
      const conn = Connection(); //conecta com o servidor backend

      const fetchFiltroIngresso = async () => {
        try {
          const response = await conn.get(
            `eventos/site/filtros?cat=${selectedEventCode.categoria}`, //faz a requisição na rota especificada
            {
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          );

          if (response.status === 200) {
            setFiltroIngresso(response.data.ingressos);
            setDataLoadedIngresso(true);
          } else {
            console.log('Erro na resposta da API:', response);
          }
        } catch (error) {
          console.error('Erro na solicitação GET:', error);
        }
      };
      fetchFiltroIngresso();
    }
  }, [selectedEventCode, dataLoadedIngresso]);

  //console.log(selectedEventCode.categoria)
  //console.log(filtroIngresso)

  const handleIncrement = () => {
    const newPage = page + 1
    setPage(newPage)
    fetchSite(newPage)
  }

  const handleDecrement = () => {
    const newPage = page - 1
    if (newPage >= 1) {
      setPage(newPage);
      fetchSite(newPage);
    }
  }

  const handleGoToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
      fetchSite(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const currentPage = page;
    let startPage = 1;
    const maxPages = Math.min(currentPage + 2, totalPages);

    if (currentPage > totalPages - 2) {
      startPage = totalPages - 2;
    } else {
      startPage = currentPage;
    }

    const pageNumbers = [];
    for (let i = startPage; i <= maxPages; i++) {
      if (i >= 1) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handleGoToPage(i)}
            className={`pagination-number ${page === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
    }
    return pageNumbers;
  };

  const handleSearch = (query) => {
    const searchQuery = query.trim() === '' ? '' : query;
    setSearchQuery(searchQuery);
    setPage(1);
    setDataLoaded(false);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value); // Atualiza o estado statusFilter com a opção selecionada
    setDataLoaded(false);
  };

  const handleIngressoFilterChange = (value) => {
    setIngressoFilter(value); // Atualiza o estado ingressoFilter com a opção selecionada
    setDataLoaded(false);
  };

  const handleRequestSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
    <Container>
      <div>
        {dataLoaded ? (
          <div>
            <Grid container spacing={3} sx={{ py: 2, flexWrap: 'wrap' }}>
              <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                <SearchBar label="Buscar por RG ou Pedido" onSearch={handleSearch} />
              </Grid>
              <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <FilterButtonStatus
                  statusOptions={filtroStatus.map((filtro) => ({
                    value: filtro,
                    label: filtro,
                  }))}
                  selectedStatus={statusFilter}
                  onStatusFilterChange={handleStatusFilterChange}
                />
                <FilterButtonIngresso
                  ingressoOptions={filtroIngresso.map((filtro) => ({
                    value: filtro,
                    label: filtro,
                  }))}
                  selectedIngresso={ingressoFilter}
                  onIngressoFilterChange={handleIngressoFilterChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1, mx: -2, backgroundColor: 'var(--grey-shadow)' }} />
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'pedido'}
                          direction={orderBy === 'pedido' ? order : 'asc'}
                          onClick={handleRequestSort('pedido')}
                        >
                          <strong>Pedido</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'data'}
                          direction={orderBy === 'data' ? order : 'asc'}
                          onClick={handleRequestSort('data')}
                        >
                          <strong>Data</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'status'}
                          direction={orderBy === 'status' ? order : 'asc'}
                          onClick={handleRequestSort('status')}
                        >
                          <strong>Status</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'comprador'}
                          direction={orderBy === 'comprador' ? order : 'asc'}
                          onClick={handleRequestSort('comprador')}
                        >
                          <strong>Comprador</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'nominado'}
                          direction={orderBy === 'nominado' ? order : 'asc'}
                          onClick={handleRequestSort('nominado')}
                        >
                          <strong>Nominado</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'email'}
                          direction={orderBy === 'email' ? order : 'asc'}
                          onClick={handleRequestSort('email')}
                        >
                          <strong>Email</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'telefone'}
                          direction={orderBy === 'telefone' ? order : 'asc'}
                          onClick={handleRequestSort('telefone')}
                        >
                          <strong>Telefone</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'quant'}
                          direction={orderBy === 'quant' ? order : 'asc'}
                          onClick={handleRequestSort('quant')}
                        >
                          <strong>Qtde</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'ingressos'}
                          direction={orderBy === 'ingressos' ? order : 'asc'}
                          onClick={handleRequestSort('ingressos')}
                        >
                          <strong>Ingresso</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableSortLabel
                          active={orderBy === 'valor'}
                          direction={orderBy === 'valor' ? order : 'asc'}
                          onClick={handleRequestSort('valor')}
                        >
                          <strong>Valor</strong>
                        </TableSortLabel>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stableSort(site, (a, b) => {
                      const isAsc = order === 'asc';
                      return isAsc ? (a[orderBy] > b[orderBy] ? 1 : -1) : b[orderBy] > a[orderBy] ? 1 : -1;
                    }).map((row, index) => (
                      <StyledTableBodyRow key={row.tipo} index={index}>
                        <StyledTableCell component="th" scope="row">
                          {row.pedido}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {format(new Date(row.data), 'dd/MM/yyyy HH:mm')}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.status}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.comprador}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.nominado}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.email}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.telefone}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.quant}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.ingressos}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.valor}
                        </StyledTableCell>
                      </StyledTableBodyRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {data && data.total && (
                <div className="pagination-container">
                  <button onClick={handleDecrement} className="pagination-button" disabled={page === 1}>
                    {"<"}
                  </button>
                  <button
                    onClick={() => handleGoToPage(1)}
                    className="pagination-button"
                    style={{ display: page === 1 ? 'none' : 'inline-block' }}
                  >
                    {"1"}
                  </button>
                  <span style={{ display: (page === 1 || page === 2) ? 'none' : 'inline-block', marginLeft: '5px' }}>
                    ...
                  </span>
                  <span className="pagination-numbers">
                    {renderPageNumbers()}
                  </span>
                  <span style={{ display: (page === totalPages) ? 'none' : 'inline-block', marginRight: '5px', marginLeft: '5px' }}>
                    ...
                  </span>
                  <button onClick={() => handleGoToPage(totalPages)} className="pagination-button" style={{ display: (page === totalPages) ? 'none' : 'inline-block' }}>
                    {totalPages}
                  </button>
                  <button onClick={handleIncrement} className="pagination-button" disabled={page === data.total}>
                    {">"}
                  </button>
                </div>
              )}
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
                <ExportExcelSite data={site} columnHeaders={columnHeaders} />
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
  );
}
import React, { useEffect, useState } from 'react';
import './tableSangria.css';
import { CircularProgress, TableContainer } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import TablePagination from '@mui/material/TablePagination';
import DownloadButton from '../../Buttons/DownloadButton';
import SearchBar from '../../Outros/SearchBar';
import Grid from '@mui/material/Grid';
import Connection from '../../../model';
import { format } from 'date-fns';
import Pagination from '@mui/material/Pagination';

// Funções de ordenação
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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

// Componente de cabeçalho de tabela com ordenação
const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headers = [
    { label: 'PDV', id: 'pdv', numeric: true },
    { label: 'Vendas', id: 'vendas', numeric: true },
    { label: 'Sangrias', id: 'sangrias', numeric: true },
    { label: 'Saldo', id: 'saldo', numeric: true },
  ];

  return (
    <thead>
      <tr>
        <th className="sangria-cabecalho"></th>
        {headers.map((header) => (
          <SortableTableCell
            key={header.id}
            label={header.label}
            numeric={header.numeric}
            order={orderBy === header.id ? order : false}
            onRequestSort={createSortHandler(header.id)}
          />
        ))}
      </tr>
    </thead>
  );
};

// Componente TableCell que suporta ordenação
const SortableTableCell = (props) => {
  const { label, numeric, order, onRequestSort } = props;

  return (
    <TableCell className="pdv-cabecalho" align={numeric ? 'left' : 'center'}>
      <TableSortLabel
        active={order !== false}
        direction={order === 'asc' ? 'asc' : 'desc'}
        onClick={onRequestSort}
      >
        {label}
        {order !== false ? (
          <span style={visuallyHidden}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </span>
        ) : null}
      </TableSortLabel>
    </TableCell>
  );
};

const TableSangria = () => {
  const [sangria, setSangria] = useState([]); // Estado para armazenar dados da rota
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados
  const [linhaSelecionada, setLinhaSelecionada] = useState(-1);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('pdv');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePagination = (event, value) => {
    setCurrentPage(value);
    setPage(value - 1);
  };

  // Recupera o objeto do evento selecionado do localStorage
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto

  const fetchSangria = async () => {
    const conn = Connection();

    try {
      const response = await conn.get(
        `eventos/sangrias?evento=${selectedEventCode.eve_cod}&busca=${searchQuery}`,
        {
          headers: {
            'token': localStorage.getItem('token')
          }
        }
      );

      if (response.status === 200) {
        const filteredSangria = response.data.filter((item) => {
          return item.nome.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setSangria(filteredSangria);
        setDataLoaded(true);
      } else {
        console.log('Erro na resposta da API (Sangria):', response);
      }
    } catch (error) {
      console.error('Erro na solicitação GET (Sangria):', error);
    }
  };

  useEffect(() => {
    if (!dataLoaded) {
      fetchSangria();
    }
  }, [dataLoaded, searchQuery]);

  const handleSearch = (query) => {
    const searchQuery = query.trim() === '' ? '' : query;
    setSearchQuery(searchQuery);
    setPage(0);
    setDataLoaded(false);

    if (searchQuery === '') {
      fetchSangria();
    }
  };

  const expandirLinha = (nome) => {
    setLinhaSelecionada(nome === linhaSelecionada ? -1 : nome);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  //console.log(sangria)

  return (
    <div>
      <Grid container sx={{ py: 2 }}>
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '5px' }}>
          <SearchBar label="Buscar PDV" onSearch={(query) => handleSearch(query)} />
        </Grid>
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '5px' }}>
          <DownloadButton />
        </Grid>
      </Grid>
      {dataLoaded ? (
        <div>
          <TableContainer>
            <table className="pdv-tabela">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <tbody>
                {stableSort(sangria, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <React.Fragment key={item.nome}>
                      <tr className={index % 2 === 0 ? 'sangria-linha-branca' : 'sangria-linha-cinza'}>
                        <td className="sangria-celula-botao">
                          <button
                            className="sangria-botao-expandir"
                            onClick={() => expandirLinha(item.nome)}
                          >
                            {item.nome === linhaSelecionada ? '-' : '+'}
                          </button>
                        </td>
                        <td className="sangria-celula">{item.nome}</td>
                        <td className="sangria-celula">{item.valor_vendas}</td>
                        <td className="sangria-celula">{item.valor_sangrias}</td>
                        <td className="sangria-celula">{item.valor_saldo}</td>
                      </tr>
                      {item.nome === linhaSelecionada && (
                        <>
                          <tr>
                            <td className="sangria-linha-azul"></td>
                            <td className="sangria-linha-azul">Data</td>
                            <td className="sangria-linha-azul">Usuário</td>
                            <td className="sangria-linha-azul">Valor</td>
                            <td className="sangria-linha-azul"></td>
                          </tr>
                          {item.sangrias.map((row) => (
                            <tr key={row.data}>
                              <td className="sangria-conteudo-expandido"></td>
                              <td className="sangria-conteudo-expandido">{format(new Date(row.data), 'dd/MM/yyyy HH:mm')}</td>
                              <td className="sangria-conteudo-expandido">{row.usuario}</td>
                              <td className="sangria-conteudo-expandido">{row.valor}</td>
                              <td className="sangria-conteudo-expandido"></td>
                            </tr>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
            <Pagination
              count={Math.ceil(sangria.length / rowsPerPage)} // Calcula o número total de páginas
              page={currentPage}
              onChange={handleChangePagination}
              showFirstButton
              showLastButton
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}
            />
          </TableContainer>
        </div>
      ) : (
        // Renderizar um indicador de carregamento enquanto os dados são buscados
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default TableSangria;

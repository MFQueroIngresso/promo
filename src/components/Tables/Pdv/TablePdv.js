import React, { useEffect, useState } from 'react';
import './tablePDV.css';
import { CircularProgress, TableContainer } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import TablePagination from '@mui/material/TablePagination';
import DownloadButton from '../../Buttons/DownloadButton';
import SearchBar from '../../Outros/SearchBar';
import Grid from '@mui/material/Grid';
import Connection from '../../../model';
import Pagination from '@mui/material/Pagination';

const TablePDV = () => {
  const [pdvs, setPdvs] = useState([]); // Estado para armazenar dados da rota
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('pdv');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [linhaSelecionada, setLinhaSelecionada] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePagination = (event, value) => {
    setCurrentPage(value);
    setPage(value - 1);
  };

  // Recupera o objeto do evento selecionado do localStorage
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto

  const fetchPdvs = async () => {
    const conn = Connection();

    try {
      const response = await conn.get(
        `eventos/pdvs?evento=${selectedEventCode.eve_cod}&busca=${searchQuery}`,
        {
          headers: {
            'token': localStorage.getItem('token')
          }
        }
      );

      if (response.status === 200) {
        const filteredPdvs = response.data.filter((item) => {
          return item.pdv.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setPdvs(filteredPdvs);
        setDataLoaded(true);

      } else {
        console.log('Erro na resposta da API (Tipo Ingresso):', response);
      }
    } catch (error) {
      console.error('Erro na solicitação GET (Tipo Ingresso):', error);
    }
  };

  useEffect(() => {
    if (selectedEventCode && !dataLoaded) {
      fetchPdvs();
    }
  }, [selectedEventCode, dataLoaded, searchQuery]);

  const handleSearch = (query) => {
    const searchQuery = query.trim() === '' ? '' : query;
    setSearchQuery(searchQuery);
    setPage(0);
    setDataLoaded(false);

    if (searchQuery === '') {
      fetchPdvs();
    }
  };

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

    //console.log(pdvs)

    return (
      <thead>
        <tr>
          <th className="pdv-cabecalho"></th>
          <SortableTableCell
            label={<b>PDV</b>}
            numeric={false}
            order={orderBy === 'pdv' ? order : false}
            onRequestSort={createSortHandler('pdv')}
          />
          <SortableTableCell
            label={<b>Qtde (Hoje)</b>}
            numeric={true}
            order={orderBy === 'quant_hoje' ? order : false}
            onRequestSort={createSortHandler('quant_hoje')}
          />
          <SortableTableCell
            label={<b>Valor (Hoje)</b>}
            numeric={false}
            order={orderBy === 'valor_hoje' ? order : false}
            onRequestSort={createSortHandler('valor_hoje')}
          />
          <SortableTableCell
            label={<b>Qtde (Total)</b>}
            numeric={true}
            order={orderBy === 'quant_total' ? order : false}
            onRequestSort={createSortHandler('quant_total')}
          />
          <SortableTableCell
            label={<b>Valor (Total)</b>}
            numeric={false}
            order={orderBy === 'valor_total' ? order : false}
            onRequestSort={createSortHandler('valor_total')}
          />
          <SortableTableCell
            label={<b>Cortesia</b>}
            numeric={false}
            order={orderBy === 'cortesias' ? order : false}
            onRequestSort={createSortHandler('cortesias')}
          />
          <SortableTableCell
            label={<b>Pgto</b>}
            numeric={false}
            order={orderBy === 'pgto' ? order : false}
            onRequestSort={createSortHandler('pgto')}
          />
        </tr>
      </thead>
    );
  };

  // Componente TableCell que suporta ordenação
  const SortableTableCell = (props) => {
    const { label, numeric, order, onRequestSort } = props;

    return (
      <TableCell className="pdv-cabecalho" align={numeric ? 'center' : 'left'}>
        <TableSortLabel
          active={order !== false}
          direction={order === 'asc' ? 'asc' : 'desc'}
          onClick={onRequestSort}
        >
          {label}
          {order !== false ? (
            <span style={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
          ) : null}
        </TableSortLabel>
      </TableCell>
    );
  };

  const expandirLinha = (pdv) => {
    setLinhaSelecionada(pdv === linhaSelecionada ? -1 : pdv);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
                {stableSort(pdvs, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <React.Fragment key={item.pdv}>
                      <tr
                        className={index % 2 === 0 ? 'pdvs-linha-branca' : 'pdvs-linha-cinza'}
                      >
                        <td className="pdv-celula">
                          <button
                            className="pdv-botao-expandir"
                            onClick={() => expandirLinha(item.pdv)}
                          >
                            {item.pdv === linhaSelecionada ? '-' : '+'}
                          </button>
                        </td>
                        <td className="pdv-celula-left">{item.pdv}</td>
                        <td className="pdv-celula">{item.quant_hoje}</td>
                        <td className="pdv-celula-left">
                          {parseFloat(item.valor_hoje).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>
                        <td className="pdv-celula">{item.quant_total}</td>
                        <td className="pdv-celula-left">
                          {parseFloat(item.valor_total).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>
                        <td className="pdv-celula">{item.cortesias}</td>
                        <td className="pdv-celula-pgto">
                          <span className="pdv-celula-span">DIN</span>
                          {parseFloat(item.meios_pgto.dinheiro).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}<br />
                          <span className="pdv-celula-span">CCR</span>
                          {parseFloat(item.meios_pgto.credito).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}<br />
                          <span className="pdv-celula-span">DEB</span>
                          {parseFloat(item.meios_pgto.debito).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}<br />
                          <span className="pdv-celula-span">PIX</span>
                          {parseFloat(item.meios_pgto.pix).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>
                      </tr>
                      {item.pdv === linhaSelecionada && (
                        <>
                          <tr>
                            <td className="pdv-linha-azul"></td>
                            <td className="pdv-linha-azul-left">Classe</td>
                            <td className="pdv-linha-azul">Qtde (Hoje)</td>
                            <td className="pdv-linha-azul-left">Valor (Hoje)</td>
                            <td className="pdv-linha-azul">Qtde (Total)</td>
                            <td className="pdv-linha-azul-left">Valor (Total)</td>
                            <td className="pdv-linha-azul">Cortesias</td>
                            <td className="pdv-linha-azul"></td>
                          </tr>
                          {item.classes.map((row) => (
                            <tr key={row.classe}>
                              <td className="pdv-conteudo-expandido"></td>
                              <td className="pdv-conteudo-expandido-left">{row.classe}</td>
                              <td className="pdv-conteudo-expandido">{row.quant_hoje}</td>
                              <td className="pdv-celula-left">
                                {parseFloat(row.valor_hoje).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                              </td>
                              <td className="pdv-conteudo-expandido">{row.quant_total}</td>
                              <td className="pdv-celula-left">
                                {parseFloat(row.valor_total).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                              </td>
                              <td className="pdv-conteudo-expandido">{row.cortesias}</td>
                              <td className="pdv-conteudo-expandido"></td>
                            </tr>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
            <Pagination
              count={Math.ceil(pdvs.length / rowsPerPage)} // Calcula o número total de páginas
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

export default TablePDV;

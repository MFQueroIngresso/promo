import React, { useEffect, useState } from 'react';
import './tableClasses.css';
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

  return (
    <thead>
      <tr>
        <th className="classes-cabecalho-botao"></th>
        <SortableTableCell
          label={<b>Categoria</b>}
          numeric={false}
          order={orderBy === 'categoria' ? order : false}
          onRequestSort={createSortHandler('categoria')}
        />
        <SortableTableCell
          label={<b>Vendas (Qtde)</b>}
          numeric={true}
          order={orderBy === 'vendas_quant' ? order : false}
          onRequestSort={createSortHandler('vendas_quant')}
        />
        <SortableTableCell
          label={<b>Cortesias (Qtde)</b>}
          numeric={true}
          order={orderBy === 'cortesias_quant' ? order : false}
          onRequestSort={createSortHandler('cortesias_quant')}
        />
        <SortableTableCell
          label={<b>Total (Qtde)</b>}
          numeric={true}
          order={orderBy === 'total_quant' ? order : false}
          onRequestSort={createSortHandler('total_quant')}
        />
        <SortableTableCell
          label={<b>Valor</b>}
          numeric={false}
          order={orderBy === 'valor_total' ? order : false}
          onRequestSort={createSortHandler('valor_total')}
        />
      </tr>
    </thead>
  );
};

// Componente TableCell que suporta ordenação
const SortableTableCell = (props) => {
  const { label, numeric, order, onRequestSort } = props;

  return (
    <TableCell className="classes-cabecalho" align={numeric ? 'center' : 'left'}>
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

const TableClasses = () => {
  const [classes, setClasses] = useState([]); // Estado para armazenar dados da rota
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados
  const [linhaSelecionada, setLinhaSelecionada] = useState(-1); // Seleciona a linha da tabela
  const [order, setOrder] = useState('asc'); // Ordenação da tabela (crescente ou decrescente)
  const [orderBy, setOrderBy] = useState('categoria'); // Tipo de ordenação
  const [page, setPage] = useState(0); // Paginação
  const [rowsPerPage, setRowsPerPage] = useState(10); // Número de linhas por página
  const [searchQuery, setSearchQuery] = useState(''); // Busca
  const [totalVendasQuant, setTotalVendasQuant] = useState(0);
  const [totalCortesiasQuant, setTotalCortesiasQuant] = useState(0);
  const [totalTotalQuant, setTotalTotalQuant] = useState(0);
  const [totalValorTotal, setTotalValorTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePagination = (event, value) => {
    setCurrentPage(value);
    setPage(value - 1);
  };

  const calculateTotalValues = () => {
    let vendasQuant = 0;
    let cortesiasQuant = 0;
    let totalQuant = 0;
    let valorTotal = 0;

    classes.forEach((item) => {
      vendasQuant += item.vendas_quant;
      cortesiasQuant += item.cortesias_quant;
      totalQuant += item.total_quant;
      valorTotal += item.valor_total;
    });

    setTotalVendasQuant(vendasQuant);
    setTotalCortesiasQuant(cortesiasQuant);
    setTotalTotalQuant(totalQuant);
    setTotalValorTotal(valorTotal);
  };

  // Recupera o objeto do evento selecionado do localStorage
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto

  const fetchClasses = async () => {
    if (selectedEventCode && !dataLoaded) {
      const conn = Connection();

      try {
        const response = await conn.get(
          `eventos/classes?evento=${selectedEventCode.eve_cod}&busca=${searchQuery}`,
          {
            headers: {
              'token': localStorage.getItem('token')
            }
          }
        );

        if (response.status === 200) {
          const filteredClasses = response.data.filter((item) => {
            return item.categoria.toLowerCase().includes(searchQuery.toLowerCase());
          });
          setClasses(filteredClasses);
          calculateTotalValues();
          setDataLoaded(true);
        } else {
          console.log('Erro na resposta da API (Tipo Ingresso):', response);
        }
      } catch (error) {
        console.error('Erro na solicitação GET (Tipo Ingresso):', error);
      }
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [selectedEventCode, dataLoaded, searchQuery]);

  useEffect(() => {
    calculateTotalValues();
  }, [classes]);

  const handleSearch = (query) => {
    const searchQuery = query.trim() === '' ? '' : query;
    setSearchQuery(searchQuery);
    setPage(0);
    setDataLoaded(false);

    if (searchQuery === '') {
      fetchClasses();
    }
  };

  const expandirLinha = (categoria) => {
    setLinhaSelecionada(categoria === linhaSelecionada ? -1 : categoria);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  //console.log(classes)

  return (
    <div>
      <Grid container sx={{ py: 2 }}>
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '5px' }}>
          <SearchBar label="Buscar Classe" onSearch={(query) => handleSearch(query)} />
        </Grid>
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '5px' }}>
          <DownloadButton />
        </Grid>
      </Grid>
      {dataLoaded ? (
        <div>
          <TableContainer>
            <table className="classes-tabela">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <tbody>
                {stableSort(classes, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <React.Fragment key={item.categoria}>
                      <tr className={index % 2 === 0 ? 'classes-linha-branca' : 'classes-linha-cinza'}>
                        <td className="classes-celula">
                          <button className="classes-botao-expandir" onClick={() => expandirLinha(item.categoria)}>
                            {item.categoria === linhaSelecionada ? '-' : '+'}
                          </button>
                        </td>
                        <td className="classes-celula-left">{item.categoria}</td>
                        <td className="classes-celula">{item.vendas_quant}</td>
                        <td className="classes-celula">{item.cortesias_quant}</td>
                        <td className="classes-celula">{item.total_quant}</td>
                        <td className="classes-celula-left">{parseFloat(item.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      </tr>
                      {item.categoria === linhaSelecionada && (
                        <>
                          <tr>
                            <td className="classes-linha-azul-left-botao">Classe</td>
                            <td className="classes-linha-azul-left">Valor</td>
                            <td className="classes-linha-azul">Vendido</td>
                            <td className="classes-linha-azul">Cortesia</td>
                            <td className="classes-linha-azul">Total</td>
                            <td className="classes-linha-azul-left">Valor Total</td>
                          </tr>
                          {item.classes.map((row) => (
                            <tr key={row.classe}>
                              <td className="classes-conteudo-expandido-left-botao">{row.classe}</td>
                              <td className="classes-conteudo-expandido-left">{parseFloat(row.valor_ing).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                              <td className="classes-conteudo-expandido">{row.vendas_quant}</td>
                              <td className="classes-conteudo-expandido">{row.cortesias_quant}</td>
                              <td className="classes-conteudo-expandido">{row.total_quant}</td>
                              <td className="classes-conteudo-expandido-left">{parseFloat(row.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
                <tr>
                  <td className="classes-rodape"></td>
                  <td className="classes-rodape-left">Total (Vendas + Cortesia)</td>
                  <td className="classes-rodape">{totalVendasQuant}</td>
                  <td className="classes-rodape">{totalCortesiasQuant}</td>
                  <td className="classes-rodape">{totalTotalQuant}</td>
                  <td className="classes-rodape-left">{parseFloat(totalValorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                </tr>
              </tbody>
            </table>
            <Pagination
              count={Math.ceil(classes.length / rowsPerPage)} // Calcula o número total de páginas
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

export default TableClasses;

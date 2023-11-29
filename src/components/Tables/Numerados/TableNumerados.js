import React, { useEffect, useState } from 'react';
import './tableNumerados.css';
import { CircularProgress, Grid, TableContainer } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import TablePagination from '@mui/material/TablePagination';
import Connection from '../../../model';
import SearchBar from '../../Outros/SearchBar';
import DownloadButton from '../../Buttons/DownloadButton';
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
        <th className="numerados-cabecalho"></th>
        <SortableTableCell
          label={<b>Classe</b>}
          numeric={true}
          order={orderBy === 'classe' ? order : false}
          onRequestSort={createSortHandler('classe')}
        />
        <SortableTableCell
          label={<b>Disponibilidade</b>}
          numeric={false}
          order={orderBy === 'disp' ? order : false}
          onRequestSort={createSortHandler('disp')}
        />
        <SortableTableCell
          label={<b>Estoque inicial</b>}
          numeric={false}
          order={orderBy === 'estq_inicial' ? order : false}
          onRequestSort={createSortHandler('estq_inicial')}
        />
        <SortableTableCell
          label={<b>Vendidos(%)</b>}
          numeric={false}
          order={orderBy === 'vendidos' ? order : false}
          onRequestSort={createSortHandler('vendidos')}
        />
        <SortableTableCell
          label={<b>Qtde (Total)</b>}
          numeric={false}
          order={orderBy === 'vendidos_perc' ? order : false}
          onRequestSort={createSortHandler('vendidos_perc')}
        />
        <SortableTableCell
          label={<b>Saldo(%)</b>}
          numeric={false}
          order={orderBy === 'saldo' ? order : false}
          onRequestSort={createSortHandler('saldo')}
        />
        <SortableTableCell
          label={<b>Saldo</b>}
          numeric={false}
          order={orderBy === 'saldo_perc' ? order : false}
          onRequestSort={createSortHandler('saldo_perc')}
        />
      </tr>
    </thead>
  );
};

// Componente TableCell que suporta ordenação
const SortableTableCell = (props) => {
  const { label, numeric, order, onRequestSort } = props;

  return (
    <TableCell className="numerados-cabecalho" align={numeric ? 'left' : 'center'}>
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

const TableNumerados = () => {
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto
  const [dados, setDados] = React.useState([]); // Estado para armazenar dados da rota
  const [dataLoaded, setDataLoaded] = React.useState(false); // Estado para controlar se os dados foram carregados
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('classe');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState(''); // Busca
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePagination = (event, value) => {
    setCurrentPage(value);
    setPage(value - 1);
  };

  // Variáveis para salvar a soma total dos valores
  let estoque = 0;
  //let porcentagem_vendas = 0;
  let vendidos_total = 0;
  //let porcentagem_saldo = 0;
  let saldo_total = 0;

  // Realiza a soma dos valores para salvar o total
  dados.forEach((item) => {
    estoque += item.estq_inicial;
    //porcentagem_vendas += item.vendidos_perc;
    vendidos_total += item.vendidos;
    //porcentagem_saldo += item.saldo_perc;
    saldo_total += item.saldo;
  });

  const fetchDados = async () => {
    if (selectedEventCode && !dataLoaded) {
      const conn = Connection();

      try {
        const response = await conn.get(
          `eventos/numerados?evento=${selectedEventCode.eve_cod}&busca=${searchQuery}`,
          {
            headers: {
              'token': localStorage.getItem('token')
            }
          }
        );

        if (response.status === 200) {
          const filteredClasses = response.data.filter((item) => {
            return item.classe.toLowerCase().includes(searchQuery.toLowerCase());
          });
          setDados(filteredClasses);
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
    fetchDados();
  }, [selectedEventCode, dataLoaded, searchQuery]);

  const handleSearch = (query) => {
    const searchQuery = query.trim() === '' ? '' : query;
    setSearchQuery(searchQuery);
    setPage(0);
    setDataLoaded(false);

    if (searchQuery === '') {
      fetchDados();
    }
  };

  //console.log(dados)

  const expandirLinha = (classe, grupo, numerado) => {
    setDados((dados) =>
      dados.map((item) => {
        if (item.classe === classe) {
          if (!grupo) {
            return { ...item, expandir: !item.expandir };
          }

          return {
            ...item,
            grupos: item.grupos.map((subItem) => {
              if (subItem.grupo === grupo) {
                if (!numerado) {
                  return { ...subItem, expandir: !subItem.expandir };
                }

                return {
                  ...subItem,
                  numerados: subItem.numerados.map((subSubItem) => {
                    if (subSubItem.numerado === numerado) {
                      return { ...subSubItem, expandir: !subSubItem.expandir };
                    }
                    return subSubItem;
                  }),
                };
              }
              return subItem;
            }),
          };
        }
        return item;
      })
    )
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div>
      {dataLoaded ? (
        <div>
          <Grid container sx={{ py: 2 }}>
            <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '5px' }}>
              <SearchBar label="Buscar Numerado" onSearch={(query) => handleSearch(query)} />
            </Grid>
            <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '5px' }}>
              <DownloadButton />
            </Grid>
          </Grid>
          <TableContainer>
            <table className="numerados-tabela">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <tbody>
                {stableSort(dados, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <React.Fragment key={item.classe}>
                      <tr className={index % 2 === 0 ? 'numerados-linha-branca' : 'numerados-linha-cinza'}>
                        <td className="numerados-celula">
                          <button
                            className="numerados-botao-expandir"
                            onClick={() => expandirLinha(item.classe)}
                          >
                            {item.expandir ? '-' : '+'}
                          </button>
                        </td>
                        <td className="numerados-celula-left">{item.classe}</td>
                        <td className={`numerados-celula ${item.disp === 'Disponível' ? 'disponivel-cell' : ''} ${item.disp === 'Parcial' ? 'parcial-cell' : ''} ${item.disp === 'Vendido' ? 'vendido-cell' : ''}`}>
                          {item.disp}
                        </td>
                        <td className="numerados-celula">{item.estq_inicial}</td>
                        <td className="numerados-celula">{item.vendidos_perc}</td>
                        <td className="numerados-celula">{item.vendidos}</td>
                        <td className="numerados-celula">{item.saldo_perc}</td>
                        <td className="numerados-celula">{item.saldo}</td>
                      </tr>
                      {item.expandir && (
                        <>
                          <tr>
                            <td className="numerados-linha-azul"></td>
                            <td className="numerados-linha-azul-left">Grupo</td>
                            <td className="numerados-linha-azul">Disponibilidade</td>
                            <td className="numerados-linha-azul">Estoque Inicial</td>
                            <td className="numerados-linha-azul">Vendidos</td>
                            <td className="numerados-linha-azul">Vendidos (%)</td>
                            <td className="numerados-linha-azul">Saldo</td>
                            <td className="numerados-linha-azul">Saldo (%)</td>
                          </tr>
                          {item.grupos.map((subItem) => (
                            <React.Fragment key={subItem.grupo}>
                              <tr>
                                <td className="numerados-celula">
                                  <button
                                    className="numerados-botao-expandir2"
                                    onClick={() => expandirLinha(item.classe, subItem.grupo)}
                                  >
                                    {subItem.expandir ? '-' : '+'}
                                  </button>
                                </td>
                                <td className="numerados-conteudo-expandido-left">{subItem.grupo}</td>
                                <td className={`numerados-conteudo-expandido ${subItem.disp === 'Disponível' ? 'disponivel-cell' : ''} ${subItem.disp === 'Parcial' ? 'parcial-cell' : ''} ${subItem.disp === 'Vendido' ? 'vendido-cell' : ''}`}>
                                  {subItem.disp}
                                </td>
                                <td className="numerados-conteudo-expandido">{subItem.estq_inicial}</td>
                                <td className="numerados-conteudo-expandido">{subItem.vendidos}</td>
                                <td className="numerados-conteudo-expandido">{subItem.vendidos_perc}</td>
                                <td className="numerados-conteudo-expandido">{subItem.saldo}</td>
                                <td className="numerados-conteudo-expandido">{subItem.saldo_perc}</td>
                              </tr>
                              {subItem.expandir && (
                                <>
                                  <tr>
                                    <td className="numerados-linha-azul-left">Numeração</td>
                                    <td className="numerados-linha-azul">Situação</td>
                                    <td className="numerados-linha-azul">Vendido ?</td>
                                    <td className="numerados-linha-azul">Cód de Barras</td>
                                    <td className="numerados-linha-azul">Qtde. Vendidos</td>
                                    <td className="numerados-linha-azul-left">Valor de Venda</td>
                                    <td className="numerados-linha-azul">Tipo de Ingresso</td>
                                    <td className="numerados-linha-azul">Pdv</td>
                                  </tr>
                                  {subItem.numerados.map((subSubItem) => (
                                    <tr key={subSubItem.numerado}>
                                      <td className="numerados-conteudo-expandido-left">{subSubItem.numerado}</td>
                                      <td className={`numerados-conteudo-expandido ${subSubItem.disp === 'Disponível' ? 'disponivel-cell' : ''} ${subSubItem.disp === 'Parcial' ? 'parcial-cell' : ''} ${subSubItem.disp === 'Vendido' ? 'vendido-cell' : ''}`}>
                                        {subSubItem.disp}
                                      </td>
                                      <td className="numerados-conteudo-expandido">{subSubItem.vendido ? 'Sim' : 'Não'}</td>
                                      <td className="numerados-conteudo-expandido">{subSubItem.cod_barras}</td>
                                      <td className="numerados-conteudo-expandido">{subSubItem.quant_vendido}</td>
                                      <td className="numerados-conteudo-expandido-left">{subSubItem.valor_venda}</td>
                                      <td className="numerados-conteudo-expandido">{subSubItem.tipo}</td>
                                      <td className="numerados-conteudo-expandido">{subSubItem.pdv}</td>
                                    </tr>
                                  ))}
                                </>
                              )}
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
                <tr>
                  <td className="numerados-rodape">Total</td>
                  <td className="numerados-rodape"></td>
                  <td className="numerados-rodape"></td>
                  <td className="numerados-rodape">{estoque}</td>
                  <td className="numerados-rodape">-</td>
                  <td className="numerados-rodape">{vendidos_total}</td>
                  <td className="numerados-rodape">-</td>
                  <td className="numerados-rodape">{saldo_total}</td>
                </tr>
              </tbody>
            </table>
            <Pagination
              count={Math.ceil(dados.length / rowsPerPage)} // Calcula o número total de páginas
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

export default TableNumerados;

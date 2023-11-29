import React, { useEffect, useState } from 'react';
import './tableDiario.css';
import { CircularProgress, TableContainer } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import TablePagination from '@mui/material/TablePagination';
import Connection from '../../../model';
import Pagination from '@mui/material/Pagination';

const TableClassesDiario = () => {
  const [diarios, setDiarios] = useState([]); // Estado para armazenar dados da rota
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePagination = (event, value) => {
    setCurrentPage(value);
    setPage(value - 1);
  };

  // Recupera o objeto do evento selecionado do localStorage
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto

  //console.log(selectedEventCode);
  //console.log(selectedEventCode.eve_cod);

  useEffect(() => {
    if (selectedEventCode && !dataLoaded) {
      const conn = Connection();

      // Acessa o endpoint de tipo de ingresso
      const fetchDiarios = async () => {
        try {
          const response = await conn.get(
            'eventos/diarios?evento=' +
            selectedEventCode.eve_cod + '&filtro=classes',
            {
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          );

          // Se der certo, salva os dados no estado de tipo de ingresso
          if (response.status === 200) {
            setDiarios(response.data);
            setDataLoaded(true)
          } else {
            console.log('Erro na resposta da API (Tipo Ingresso):', response);
          }
        } catch (error) {
          console.error('Erro na solicitação GET (Tipo Ingresso):', error);
        }
      };

      fetchDiarios();
    }
  }, [selectedEventCode, dataLoaded]);

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

  const EnhancedTableHead = (props) => {
    const { order, orderBy, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    //console.log(diarios)

    return (
      <thead>
        <tr>
          <th className="diario-cabecalho"></th>
          <SortableTableCell
            label={<b>Data</b>}
            numeric={false}
            order={orderBy === 'data' ? order : false}
            onRequestSort={createSortHandler('data')}
          />
          <SortableTableCell
            label={<b>Prazo p/ evento</b>}
            numeric={true}
            order={orderBy === 'prazo' ? order : false}
            onRequestSort={createSortHandler('prazo')}
          />
          <SortableTableCell
            label={<b>Vendidos</b>}
            numeric={true}
            order={orderBy === 'vendidos' ? order : false}
            onRequestSort={createSortHandler('vendidos')}
          />
          <SortableTableCell
            label={<b>Cortesias</b>}
            numeric={true}
            order={orderBy === 'cortesias' ? order : false}
            onRequestSort={createSortHandler('cortesias')}
          />
          <SortableTableCell
            label={<b>Valor</b>}
            numeric={false}
            order={orderBy === 'valor' ? order : false}
            onRequestSort={createSortHandler('valor')}
          />
        </tr>
      </thead>
    );
  };

  const SortableTableCell = (props) => {
    const { label, numeric, order, onRequestSort } = props;

    return (
      <TableCell className="diario-cabecalho" align={numeric ? 'center' : 'left'}>
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

  const [linhaSelecionada, setLinhaSelecionada] = useState(-1);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('data');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const expandirLinha = (data) => {
    setLinhaSelecionada(data === linhaSelecionada ? -1 : data);
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
          <TableContainer>
            <table className="diario-tabela">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <tbody>
                {stableSort(diarios, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <React.Fragment key={item.data}>
                      <tr
                        className={index % 2 === 0 ? 'diario-linha-branca' : 'diario-linha-cinza'}
                      >
                        <td className="diario-celula">
                          <button
                            className="diario-botao-expandir"
                            onClick={() => expandirLinha(item.data)}
                          >
                            {item.data === linhaSelecionada ? '-' : '+'}
                          </button>
                        </td>
                        <td className="diario-celula-left">{item.data}</td>
                        <td className="diario-celula">{item.prazo}</td>
                        <td className="diario-celula">{item.vendidos}</td>
                        <td className="diario-celula">{item.cortesias}</td>
                        <td className="diario-celula-left">{parseFloat(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      </tr>
                      {item.data === linhaSelecionada && (
                        <>
                          <tr>
                            <td className="diario-linha-azul"></td>
                            <td className="diario-linha-azul-left">Nome</td>
                            <td className="diario-linha-azul"></td>
                            <td className="diario-linha-azul">Ingressos Vendidos</td>
                            <td className="diario-linha-azul">Cortesias Emitidas</td>
                            <td className="diario-linha-azul-left">Total Vendidos</td>
                          </tr>
                          {item.vendas.map((row) => (
                            <tr>
                              <td className="diario-conteudo-expandido"></td>
                              <td className="diario-conteudo-expandido-left">{row.nome}</td>
                              <td className="diario-conteudo-expandido"></td>
                              <td className="diario-conteudo-expandido">{row.vendidos}</td>
                              <td className="diario-conteudo-expandido">{row.cortesias}</td>
                              <td className="diario-conteudo-expandido-left">{parseFloat(row.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
            <Pagination
              count={Math.ceil(diarios.length / rowsPerPage)} // Calcula o número total de páginas
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

export default TableClassesDiario;

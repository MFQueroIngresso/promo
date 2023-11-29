import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Connection from '../../model';

const PeriodicChart = () => {
  const [periodoMetrics, setPeriodoMetrics] = useState([]); // Estado para armazenar dados da rota
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados

  // Recupera o objeto do evento selecionado do localStorage
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto

  //console.log(selectedEventCode);
  //console.log(selectedEventCode.eve_cod);

  useEffect(() => {
    if (selectedEventCode && !dataLoaded) {
      const conn = Connection();

      // Acessa o endpoint de períodos
      const fetchPeriodoMetrics = async () => {
        try {
          const response = await conn.get(
            'metrics/periodo?evento=' +
            selectedEventCode.eve_cod,
            {
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          );

          // Se der certo, salva os dados no estado de períodos
          if (response.status === 200) {
            setPeriodoMetrics(response.data);
            setDataLoaded(true)
          } else {
            console.log('Erro na resposta da API (Período):', response);
          }
        } catch (error) {
          console.error('Erro na solicitação GET (Período):', error);
        }
      };

      fetchPeriodoMetrics();
    }
  }, [selectedEventCode, dataLoaded]);

  //console.log('Período: ' + periodoMetrics)

  // Dados do gráfico periódico
  const periodos = periodoMetrics.map(item => ({
    dia: item.dia,
    venda: item.venda,
    cortesia: item.cortesia,
    valor: item.valor,
    total: item.total,
    acumulado_quant: item.acumulado_quant,
    acumulado_valor: item.acumulado_valor
  }))

  //console.log('Período:' + periodos.tipo)

  return (
    <React.Fragment>
      <Typography component="h2" variant="subtitle1" sx={{ p: 1, mb: 2, mt: 5, fontSize: '14px' }} align="center" fontWeight="bold" fontFamily="'Century Gothic', Futura, sans-serif" gutterBottom>
        Gráfico Periódico
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={periodos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelStyle={{ fontSize: 14 }}
            itemStyle={{ fontSize: 14 }}
          />
          <Legend wrapperStyle={{ fontSize: 14 }} />
          <Line type="monotone" dataKey="venda" stroke="#8884d8" />
          <Line type="monotone" dataKey="cortesia" stroke="var(--blue)" />
          <Line type="monotone" dataKey="total" stroke="green" />
          <Line type="monotone" dataKey="acumulado_quant" stroke="red" />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default PeriodicChart;
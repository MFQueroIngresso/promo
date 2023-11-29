import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Connection from '../../model';

const TimeChart = ({ data }) => {
  const [horarioMetrics, setHorarioMetrics] = useState([]); // Estado para armazenar dados da rota
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados

  // Recupera o objeto do evento selecionado do localStorage
  const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
  const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto

  //console.log(selectedEventCode);
  //console.log(selectedEventCode.eve_cod);

  useEffect(() => {
    if (selectedEventCode && !dataLoaded) {
      const conn = Connection();

      // Acessa o endpoint de horário de vendas
      const fetchHorarioMetrics = async () => {
        try {
          const response = await conn.get(
            'metrics/horario_venda?evento=' +
            selectedEventCode.eve_cod,
            {
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          );

          // Se der certo, salva os dados no estado de horário
          if (response.status === 200) {
            setHorarioMetrics(response.data);
            setDataLoaded(true)
          } else {
            console.log('Erro na resposta da API (Horário):', response);
          }
        } catch (error) {
          console.error('Erro na solicitação GET (Horário):', error);
        }
      };

      fetchHorarioMetrics();
    }
  }, [selectedEventCode, dataLoaded]);

  //console.log('Horário: ' + horarioMetrics)

  // Dados do gráfico de horário
  const horarios = horarioMetrics.map(item => ({
    horario: item.horario,
    pdv: item.pdv,
    web: item.web
  }))

  //console.log('Horário:' + horarios.tipo)

  return (
    <React.Fragment>
      <Typography component="h2" variant="subtitle1" sx={{ p: 1, mb: 2, mt: 5, fontSize: '14px' }} align="center" fontWeight="bold" fontFamily="'Century Gothic', Futura, sans-serif" gutterBottom>
        Horário x Canal de Venda
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={horarios}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="horario" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelStyle={{ fontSize: 14 }}
            itemStyle={{ fontSize: 14 }}
          />
          <Legend wrapperStyle={{ fontSize: 14 }} />
          <Line type="monotone" dataKey="pdv" stroke="#8884d8" name="PDV" />
          <Line type="monotone" dataKey="web" stroke="var(--blue)" name="WEB" />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default TimeChart;
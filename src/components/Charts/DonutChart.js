import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import Connection from '../../model';

const DonutChart = () => {
    const [tipoIngressoMetrics, setTipoIngressoMetrics] = useState([]); // Estado para armazenar dados da rota
    const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados
  
    // Recupera o objeto do evento selecionado do localStorage
    const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
    const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto
  
    //console.log(selectedEventCode);
    //console.log(selectedEventCode.eve_cod);
  
    useEffect(() => {
      if (selectedEventCode && !dataLoaded) {
        const conn = Connection();
    
        // Acessa o endpoint de tipo de ingresso
        const fetchTipoIngressoMetrics = async () => {
          try {
            const response = await conn.get(
              'metrics/tipo_ingresso?evento=' +
                selectedEventCode.eve_cod,
              {
                headers: {
                  'token': localStorage.getItem('token')
                }
              }
            );
    
            // Se der certo, salva os dados no estado de tipo de ingresso
            if (response.status === 200) {
              setTipoIngressoMetrics(response.data);
              setDataLoaded(true)
            } else {
              console.log('Erro na resposta da API (Tipo Ingresso):', response);
            }
          } catch (error) {
            console.error('Erro na solicitação GET (Tipo Ingresso):', error);
          }
        };

        fetchTipoIngressoMetrics();
      }
    }, [selectedEventCode, dataLoaded]);

    //console.log(tipoIngressoMetrics)
    
    // Dados do gráfico de vendas
    const dataVendas = [
      { tipo: 'Vendas', quantidade: tipoIngressoMetrics.vendas },
      { tipo: 'Cortesias', quantidade: tipoIngressoMetrics.cortesias },
    ];
  const COLORS = ['#8884d8', 'var(--blue)'];

  return (
    <React.Fragment>
      <Typography component='h2' variant="subtitle1" sx={{ p: 1, mb: 2, mt: 5, fontSize: '14px' }} align='center' fontWeight="bold" fontFamily="'Century Gothic', Futura, sans-serif" gutterBottom>
        Tipos de Ingresso
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dataVendas}
            dataKey="quantidade"
            nameKey="tipo"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fontSize={'14px'}
            fill="var(--blue)"
            label
          >
            {dataVendas.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 14 }} />
          <Tooltip
            labelStyle={{ fontSize: 14 }}
            itemStyle={{ fontSize: 14 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default DonutChart;
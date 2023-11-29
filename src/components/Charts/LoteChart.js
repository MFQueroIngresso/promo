import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Connection from '../../model';

const LoteChart = () => {
    const [vendaLotesMetrics, setVendaLotesMetrics] = useState([]); // Estado para armazenar dados da rota
    const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados

    // Recupera o objeto do evento selecionado do localStorage
    const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
    const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto

    //console.log(selectedEventCode);
    //console.log(selectedEventCode.eve_cod);

    useEffect(() => {
        if (selectedEventCode && !dataLoaded) {
            const conn = Connection();

            // Acessa o endpoint de lotes
            const fetchVendaLotesMetrics = async () => {
                try {
                    const response = await conn.get(
                        'metrics/lotes?evento=' +
                        selectedEventCode.eve_cod,
                        {
                            headers: {
                                'token': localStorage.getItem('token')
                            }
                        }
                    );

                    // Se der certo, salva os dados no estado de lotes
                    if (response.status === 200) {
                        setVendaLotesMetrics(response.data);
                        setDataLoaded(true)
                    } else {
                        console.log('Erro na resposta da API (Lotes):', response);
                    }
                } catch (error) {
                    console.error('Erro na solicitação GET (Lotes):', error);
                }
            };

            fetchVendaLotesMetrics();
        }
    }, [selectedEventCode, dataLoaded]);

    //console.log('Lote: ' + vendaLotesMetrics)

    // Dados do gráfico de lotes
    const lotes = vendaLotesMetrics.map(item => ({
        tipo: item.lote,
        quantidade: item.quant
    }))

    //console.log('Lote:' + lotes.tipo)

    return (
        <React.Fragment>
            <Typography component='h2' variant="subtitle1" sx={{ p: 1, mb: 2, mt: 5, fontSize: '14px' }} align='center' fontWeight="bold" fontFamily="'Century Gothic', Futura, sans-serif" gutterBottom>
                Vendas por Lote
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={lotes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="tipo" type="category" tick={{ fontSize: 12 }} />
                    <Tooltip
                        labelStyle={{ fontSize: 14 }}
                        itemStyle={{ fontSize: 14 }}
                    />
                    <Bar dataKey="quantidade" fill="#FCA503" />
                </BarChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default LoteChart;

import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Connection from '../../model';

const FaturamentoChart = () => {
    const [pagamentoMetrics, setPagamentoMetrics] = useState([]); // Estado para armazenar dados da rota
    const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados foram carregados

    // Recupera o objeto do evento selecionado do localStorage
    const selectedEventCodeJSON = localStorage.getItem("selectedEvent");
    const selectedEventCode = JSON.parse(selectedEventCodeJSON); // Converte a string JSON em um objeto

    //console.log(selectedEventCode);
    //console.log(selectedEventCode.eve_cod);

    useEffect(() => {
        if (selectedEventCode && !dataLoaded) {
            const conn = Connection();

            // Acessa o endpoint de pagamento
            const fetchPagamentoMetrics = async () => {
                try {
                    const response = await conn.get(
                        'metrics/mpgto?evento=' +
                        selectedEventCode.eve_cod,
                        {
                            headers: {
                                'token': localStorage.getItem('token')
                            }
                        }
                    );

                    // Se der certo, salva os dados no estado de pagamento
                    if (response.status === 200) {
                        setPagamentoMetrics(response.data);
                        setDataLoaded(true)
                    } else {
                        console.log('Erro na resposta da API (Pagamento):', response);
                    }
                } catch (error) {
                    console.error('Erro na solicitação GET (Pagamento):', error);
                }
            };

            fetchPagamentoMetrics();
        }
    }, [selectedEventCode, dataLoaded]);

    //console.log('Lote: ' + pagamentoMetrics)

    // Dados do gráfico de pagamento
    const pagamentos = pagamentoMetrics.map(item => ({
        nome: item.nome,
        quantidade: item.quant,
        valor: item.valor,
        porcentagem: item.perc
    }))

    //console.log('Lote:' + pagamentos.tipo)

    return (
        <React.Fragment>
            <Typography component='h2' variant="subtitle1" sx={{ p: 1, mb: 2, mt: 5, fontSize: '14px' }} align='center' fontWeight="bold" fontFamily="'Century Gothic', Futura, sans-serif" gutterBottom>
                Faturamento por meio de pagamento
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart width={1000} height={250} data={pagamentos} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="nome" type="category" tick={{ fontSize: 12 }} />
                    <Tooltip
                        labelStyle={{ fontSize: 14 }}
                        itemStyle={{ fontSize: 14 }}
                    />
                    <Bar dataKey="quantidade" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default FaturamentoChart;

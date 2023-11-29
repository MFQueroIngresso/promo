import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const ContainerCharts = ({ button1Content }) => {
    const [activeButton, setActiveButton] = useState(1);

    const handleButtonClick = (buttonNumber) => {
        setActiveButton(buttonNumber);
    };

    return (
        <Grid item xs={12}>
            <Box textAlign="center">
                <Button onClick={() => handleButtonClick(1)} variant="contained" className={activeButton === 1 ? 'active' : ''} sx={{
                    backgroundColor: 'var(--body-background)', color: 'var(--blue)', fontWeight: 'bold', '&:hover': {
                        backgroundColor: 'white', boxShadow: "none"
                    }, boxShadow: "none", borderRadius: 0, mb: -0.2, fontSize: '0.8rem', px: 0.5
                }}>
                    Visão Geral
                </Button>
                <Box sx={{ backgroundColor: 'white', borderTop: '1px solid var(--grey-shadow)', boxShadow: 2 }}>
                    <Typography variant="h6" component="div" mt={2} p={2}>
                            <div>{button1Content}</div>
                    </Typography>
                </Box>
                <style jsx>{`
                    .active {
                    background-color: white !important;
                    border-top: 1px solid var(--grey-shadow);
                    border-right: 1px solid var(--grey-shadow);
                    border-left: 1px solid var(--grey-shadow);
                    border-bottom: 1px solid var(white);
                    }
                `}</style>
            </Box>
        </Grid>
    );
};

export default ContainerCharts;

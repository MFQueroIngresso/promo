import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function FilterEventos({ eventFilter, onEventFilterChange }) {

  const handleChange = (event) => { //função de selecionar filtro
    const selectedValue = event.target.value; //define o valor da variável como a opção atual
    onEventFilterChange(selectedValue); //passa variável como parâmetro da função
  };

  return (
    <Box sx={{ width: '250px', marginRight: '7px' }}>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label">Eventos</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={eventFilter}
          label="Eventos"
          onChange={handleChange}
          sx={{ height: '39px' }}
        >
          {/* opções de filtro */}
          <MenuItem value={1}>Todos</MenuItem>
          <MenuItem value={0}>Eventos ativos</MenuItem>
          <MenuItem value={2}>Eventos encerrados</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

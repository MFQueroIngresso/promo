import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function FilterButtonPdv({ onPdvFilterChange, pdvOptions, selectedPdv }) {

  const handleChange = (event) => { //função de selecionar filtro
    const selectedValue = event.target.value; //define o valor da variável como a opção atual
    onPdvFilterChange(selectedValue); //passa variável como parâmetro da função
  };

  return (
    <Box sx={{ minWidth: 123, maxWidth: 250, marginRight: '7px' }}>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label">Pdv</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedPdv} //define o valor como o filtro selecionado
          label="Pdv"
          onChange={handleChange} //função de seleção
          sx={{ height: '39px' }}
        >
          <MenuItem>Selecione...</MenuItem>
          {pdvOptions.map((option) => ( //mapeamento das opções
            <MenuItem key={option.value} value={option.value}> {/* define os valores das opções */}
              {option.label} {/* define o texto da opção */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
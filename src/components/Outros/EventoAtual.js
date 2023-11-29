import * as React from 'react';
import Typography from '@mui/material/Typography';

function EventoAtual(props) {
  return (
    <div>
      <Typography component="span" variant="subtitle1" color="text.primary" fontFamily="'Century Gothic', Futura, sans-serif" style={{ fontSize: '14px' }}>
        Evento: &nbsp;
      </Typography>
      <Typography component="span" variant="subtitle1" color="text.primary" fontFamily="'Century Gothic', Futura, sans-serif" fontWeight="bold" style={{ fontSize: '14px' }}>
        {props.nomeEvento}
      </Typography>
      <br />
      <Typography component="span" variant="subtitle1" color="text.secondary" fontFamily="'Century Gothic', Futura, sans-serif" style={{ fontSize: '14px' }}>
        Data: &nbsp;
      </Typography>
      <Typography component="span" variant="subtitle1" color="text.secondary" fontFamily="'Century Gothic', Futura, sans-serif" style={{ fontSize: '14px' }}>
        {props.dataEvento}
      </Typography>
      <br />
      <Typography component="span" variant="subtitle1" color="text.secondary" fontFamily="'Century Gothic', Futura, sans-serif" style={{ fontSize: '14px' }}>
        Local: &nbsp;
      </Typography>
      <Typography component="span" variant="subtitle1" color="text.secondary" fontFamily="'Century Gothic', Futura, sans-serif" style={{ fontSize: '14px' }}>
        {props.localEvento}
      </Typography>
      <br />
      <Typography component="span" variant="subtitle1" color="text.secondary" fontFamily="'Century Gothic', Futura, sans-serif" style={{ fontSize: '14px' }}>
        Cidade: &nbsp;
      </Typography>
      <Typography component="span" variant="subtitle1" color="text.secondary" fontFamily="'Century Gothic', Futura, sans-serif" style={{ fontSize: '14px' }}>
        {props.cidadeEvento}
      </Typography>
    </div>
  );
}

export default EventoAtual;

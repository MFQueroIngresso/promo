import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Typography from '@mui/material/Typography';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NumbersIcon from '@mui/icons-material/Numbers';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
//import ReceiptIcon from '@mui/icons-material/Receipt';
//import AnalyticsIcon from '@mui/icons-material/Analytics';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
//import SellIcon from '@mui/icons-material/Sell';
//import InventoryIcon from '@mui/icons-material/Inventory';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/home" sx={{ color: 'white' }}>
      <ListItemIcon>
        <DashboardIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Geral
          </Typography>
        }
      />
    </ListItemButton>
    <ListItemButton component={Link} to="/classes" sx={{ color: 'white' }}>
      <ListItemIcon>
        <LocalActivityIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Classes
          </Typography>
        }
      />
    </ListItemButton>
    <ListItemButton component={Link} to="/pdv" sx={{ color: 'white' }}>
      <ListItemIcon>
        <ShoppingCartIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            PDVs
          </Typography>
        }
      />
    </ListItemButton>
    <ListItemButton component={Link} to="/diarios" sx={{ color: 'white' }}>
      <ListItemIcon>
        <CalendarTodayIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Diários
          </Typography>
        }
      />
    </ListItemButton>
    <ListItemButton component={Link} to="/Numerados" sx={{ color: 'white' }}>
      <ListItemIcon>
        <NumbersIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Numerados
          </Typography>
        }
      />
    </ListItemButton>
    <ListItemButton component={Link} to="/Cancelados" sx={{ color: 'white' }}>
      <ListItemIcon>
        <NotInterestedIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Cancelados
          </Typography>
        }
      />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    {/* 
    <ListItemButton sx={{ color: 'white' }}>
      <ListItemIcon>
        <SellIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Comissários#
          </Typography>
        }
      />
    </ListItemButton>
    */}
    <ListItemButton component={Link} to="/site" sx={{ color: 'white' }}>
      <ListItemIcon>
        <BarChartIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Site Detalhados
          </Typography>
        }
      />
    </ListItemButton>
    <ListItemButton component={Link} to="/Detalhados" sx={{ color: 'white' }}>
      <ListItemIcon>
        <AssignmentIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Detalhados
          </Typography>
        }
      />
    </ListItemButton>
  </React.Fragment>
);

/*
export const tertiaryListItems = (
  <React.Fragment>
    <ListItemButton sx={{ color: 'white' }}>
      <ListItemIcon>
        <AnalyticsIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Visualização x <br/> Vendas Web#
          </Typography>
        }
      />
    </ListItemButton>
  </React.Fragment>
);
*/

export const quaternaryListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/sangria" sx={{ color: 'white' }}>
      <ListItemIcon>
        <CurrencyExchangeIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Sangrias
          </Typography>
        }
      />
    </ListItemButton>
    {/* 
    <ListItemButton sx={{ color: 'white' }}>
      <ListItemIcon>
        <ReceiptIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Sangrias <br/> Comprovantes#
          </Typography>
        }
      />
    </ListItemButton>
    */}
  </React.Fragment>
);

/*
export const quinaryListItems = (
  <React.Fragment>
    <ListItemButton sx={{ color: 'white' }}>
      <ListItemIcon>
        <InventoryIcon sx={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" style={{ fontSize: '0.9rem', fontFamily: "'Century Gothic', Futura, sans-serif" }}>
            Gestão de Lotes#
          </Typography>
        }
      />
    </ListItemButton>
  </React.Fragment>
);
*/
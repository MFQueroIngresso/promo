import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/quero_ingresso_logo.png';
import Connection from '../../model/index';
import { useToken } from '../../model/tokenContext';
import "./login.css";
import { useLogin } from '../../model/loginContext';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ login: '', senha: '' });
  const [error, setError] = useState('');
  const { setToken } = useToken();
  const { setLogin } = useLogin();

  localStorage.clear();

  const checkVazio = () => {
        let isVazio = false
        if (document.getElementById('Login').value === '') {
            isVazio = true
            return isVazio
        }
        if (document.getElementById('Password').value === '') {
            isVazio = true
            return isVazio
        }
    }

  const handleLoginChange = (event) => {
    setLoginData({ ...loginData, login: event.target.value });
  };

  const handlePasswordChange = (event) => {
    setLoginData({ ...loginData, senha: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (checkVazio()) {
      setError('Preencha suas credenciais.');
      return;
    }
  
    try {
      const conn = Connection();
      const response = await conn.post('/user/login', loginData);
  
      if (response.status === 200) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token)
        setLogin(loginData.login)
        localStorage.setItem('login', loginData.login)
        navigate('/eventos');
      }
    } catch (error) {
      console.error('Erro durante a requisição:', error);
      setError('Credenciais inválidas');
    }
  }

  /*const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const conn = Connection();
      const response = await conn.post('/user/login', loginData);

      if (response.status === 200) {
        setToken(response.data.token);
        navigate('/eventos');
      } else {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error) {
      setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
    }
  };*/

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={handleSubmit}>
            <img src={logo} alt='home' />

            <div className="mb-3">
              <input
                type="text"
                id="Login"
                className="form-control"
                placeholder="Login"
                value={loginData.login}
                onChange={handleLoginChange}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                id="Password"
                className="form-control"
                placeholder="Senha"
                value={loginData.senha}
                onChange={handlePasswordChange}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            {/*<div className="mb-3">
              <div className="custom-control custom-checkbox d-flex align-items-center">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Lembrar-me
                </label>
              </div>
            </div>*/}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

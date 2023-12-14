import axios from 'axios';

export default function Connection() {
    const url = 'http://promo.mfhosting.com.br/';
	//const url = 'http://localhost:3000/';

    const conn = axios.create({
        baseURL: url
    })

    return conn;
}
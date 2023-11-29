import axios from 'axios';

export default function Connection() {
    const url = 'https://api-promo-server.onrender.com/';
	//const url = 'http://localhost:3000/';

    const conn = axios.create({
        baseURL: url
    })

    return conn;
}
import axios from 'axios';

export default function Connection() {
    const url = 'http://172.31.41.220:3000';
	//const url = 'http://localhost:3000/';

    const conn = axios.create({
        baseURL: url
    })

    return conn;
}
import axios from 'axios';

export default function Connection() {
    const url = 'http://ec2-3-144-131-74.us-east-2.compute.amazonaws.com:3000/';
	//const url = 'http://localhost:3000/';

    const conn = axios.create({
        baseURL: url
    })

    return conn;
}

const http = require('http');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;
const server = http.createServer((req, res) => {
	res.end('<h1>Hello world</h1>');
});

server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});

console.log(process.env.PORT);

const http = require('http');

function callAPI(payload) {

    return new Promise((resolve, reject) => {

        const data = JSON.stringify(payload);

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, res => {

            let body = '';

            res.on('data', chunk => body += chunk);

            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch {
                    resolve(body);
                }
            });
        });

        req.on('error', err => reject(err));

        req.write(data);
        req.end();
    });
}

module.exports = callAPI;

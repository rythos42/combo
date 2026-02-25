const https = require('https');
const fs = require('fs');

const commodityCombo = JSON.parse(process.argv[2]);
const promises = [];
commodityCombo.forEach(function (commodity) {
    promises.push(getCommodities(commodity.code.replace('"', '').trim()));
});

Promise
    .all(promises)
    .then(commodityList => {
        const terminals = Object.groupBy(
            commodityList
                .flat()
                .filter(c => c.price_sell > 0),
            c => c.terminal_name
        );

        const tableEntries = [];
        Object.entries(terminals).forEach((terminal) => {
            const [terminalName, terminalCommodities] = terminal;
            let profit = 0;
            const commodityEntries = [];
            if (terminalCommodities.length <= 0 || terminalCommodities.length < commodityCombo.length)
                return;

            terminalCommodities.forEach(c => {
                profit += c.price_sell * commodityCombo.find(combo => combo.code === c.commodity_code).count;
                commodityEntries.push(c);
            });

            tableEntries.push({
                name: terminalName,
                profit: profit,
                commodities: commodityEntries
            });

        });

        tableEntries.sort((entry1, entry2) => entry2.profit - entry1.profit);

        let content = '';
        content += '<table>';
        content += '<thead><tr><th>Terminal</th>';
        commodityCombo.forEach(commodity => {
            content += `<th>${commodity.code}</th>`;
        });
        content += '<th>Profit</th></tr></thead>';

        tableEntries.forEach(entry => {
            content += `<tr><td>${entry.name}</td>`;

            commodityCombo.forEach(commodity => {
                const price = entry.commodities.find(c => c.commodity_code === commodity.code).price_sell;
                content += `<td>${price}</td>`;
            });

            content += `<td>${entry.profit}</td>`;
            content += '</tr>';
        });

        content += '</table>';

        fs.writeFile('output.html', content, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('File has been written successfully.');
        });
    }).catch(error => {
        console.error('Error fetching commodities:', error);
    });

async function getCommodities(code) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.uexcorp.uk',
            path: `/2.0/commodities_prices?commodity_code=${encodeURI(code)}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer d5b1f77d12204c4cc34f8462a3518583f49c59ca'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data).data);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}
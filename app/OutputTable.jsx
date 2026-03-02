import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Button,
    Tooltip
} from "@mui/material";

import CommodityHeaderCell from "./CommodityHeaderCell";
import CommodityOutputCell from "./CommodityOutputCell";

export default async function OutputTable({ inputData }) {
    async function getCommodities(code) {
        const fetchResult = await fetch(`https://api.uexcorp.uk/2.0/commodities_prices?commodity_code=${encodeURI(code)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.UEX_KEY}`
            }
        });

        if (fetchResult.status !== 200)
            throw new Error(`Failed to fetch commodity data for code ${code}: ${fetchResult.status} ${fetchResult.statusText}`);

        const jsonResult = await fetchResult.json();
        if (!jsonResult)
            throw new Error(`Failed to parse JSON for commodity code ${code}`);

        return jsonResult.data;
    }

    try {
        const format = new Intl.NumberFormat('en-US');
        const promises = [];
        inputData.rows.forEach(function (commodity) {
            promises.push(getCommodities(commodity.code));
        });

        const commodityList = await Promise.all(promises);

        const terminals = Object.groupBy(
            commodityList
                .flat()
                .filter(commodity => commodity.price_sell > 0),
            commodity => commodity.terminal_name
        );

        const maxCommodityPrices = {};
        inputData.rows.forEach(commodity => {
            let maxPriceCommodity = maxCommodityPrices[commodity.code];
            if (!maxPriceCommodity) {
                maxPriceCommodity = { commodity_code: commodity.code, price_sell: 0 };
                maxCommodityPrices[commodity.code] = maxPriceCommodity;
            }

            Object.values(terminals).flat().forEach(terminal => {
                if (terminal.commodity_code === commodity.code && terminal.price_sell > maxPriceCommodity.price_sell) {
                    maxPriceCommodity = terminal;
                }
            });
            maxCommodityPrices[commodity.code] = maxPriceCommodity;
        });

        const tableEntries = [];
        let maxProfit = 0;
        Object.entries(terminals).forEach((terminal) => {
            const [terminalName, terminalCommodities] = terminal;
            let profit = 0;
            const commodityEntries = [];
            if (terminalCommodities.length <= 0 || terminalCommodities.length < inputData.rows.length)
                return;

            let profitTooltip = '';
            let prefix = '';
            terminalCommodities.forEach(commodity => {
                const count = inputData.rows.find(combo => combo.code === commodity.commodity_code)?.count || 0;
                profit += commodity.price_sell * count;
                profitTooltip += `${prefix} ${format.format(commodity.price_sell)} * ${count} `;
                prefix = '+';
                commodityEntries.push(commodity);
            });

            maxProfit = Math.max(maxProfit, profit);
            profitTooltip += `= ${format.format(profit)}`;

            tableEntries.push({
                name: terminalName,
                profit: profit,
                profitTooltip: profitTooltip,
                commodities: commodityEntries
            });
        });

        tableEntries.forEach(entry => entry.profitDifference = entry.profit - maxProfit);
        tableEntries.sort((entry1, entry2) => entry2.profit - entry1.profit);

        return (
            <Paper sx={{ maxWidth: 1200, margin: 'auto', marginTop: 5, padding: 2, display: 'flex', alignItems: 'flex-end', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Button href="/">Back</Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Terminal</TableCell>
                                {inputData.rows.map(commodity => (
                                    <CommodityHeaderCell key={commodity.code} commodity={commodity} apiCommodity={maxCommodityPrices[commodity.code]} />
                                ))}
                                <TableCell>Profit</TableCell>
                                <TableCell>Diff</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableEntries && tableEntries.length !== 0 ? tableEntries.map(entry => (
                                <TableRow key={entry.name}>
                                    <TableCell>{entry.name}</TableCell>
                                    {inputData.rows.map(commodity => (
                                        <CommodityOutputCell
                                            key={commodity.code}
                                            commodity={commodity}
                                            commodities={entry.commodities}
                                            maxPriceCommodity={maxCommodityPrices[commodity.code]}
                                            acceptableProfitLossPerScu={inputData.acceptableProfitLossPerScu}
                                        />
                                    ))}
                                    <Tooltip title={entry.profitTooltip}>
                                        <TableCell>{format.format(entry.profit)}</TableCell>
                                    </Tooltip>
                                    <Tooltip title={`${format.format(entry.profit + entry.profitDifference)} - ${format.format(entry.profit)} = ${format.format(entry.profitDifference)}`}>
                                        <TableCell>{format.format(entry.profitDifference)}</TableCell>
                                    </Tooltip>
                                </TableRow>
                            ))
                                : <TableRow>
                                    <TableCell colSpan={inputData.rows.length + 2} align="center">No data available.</TableCell>
                                </TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button href="/">Back</Button>
            </Paper>
        );
    } catch (error) {
        console.error('Error fetching commodity data:', error);
        return (
            <Paper sx={{ width: 700, margin: 'auto', marginTop: 5, padding: 2, display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                <h2>Error fetching commodity data</h2>
                <p>{error.message}</p>
                <Button href="/">Back</Button>
            </Paper>
        );
    }
}
'use client';

import {
    TableCell,
    IconButton,
    Popover,
    Typography,
    Tooltip,
    Table,
    TableBody,
    TableRow,
    TableContainer,
    Button
} from "@mui/material";
import InfoIcon from '@mui/icons-material/InfoOutline';
import { useState } from 'react';

export default function CommodityOutputCell({ commodity, commodities, maxPriceCommodity }) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverContent, setPopoverContent] = useState('Nothing');
    const [anchorEl, setAnchorEl] = useState(null);
    const format = new Intl.NumberFormat('en-US');

    const apiCommodity = commodities.find(c => c.commodity_code === commodity.code);

    function getPopoverContent(apiCommodity) {
        return (
            <>
                <Typography variant="h6">{apiCommodity.commodity_name} ({apiCommodity.commodity_code})</Typography>
                <TableContainer sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell>Max Price Terminal</TableCell><TableCell>{maxPriceCommodity.terminal_name}</TableCell></TableRow>
                            <TableRow><TableCell>Max Price</TableCell><TableCell>{format.format(maxPriceCommodity.price_sell)}</TableCell></TableRow>
                            <TableRow><TableCell>Profit Diff if Sold Here</TableCell><TableCell>{format.format((maxPriceCommodity.price_sell - apiCommodity.price_sell) * commodity.count)}</TableCell></TableRow>
                            <TableRow><TableCell></TableCell><TableCell></TableCell></TableRow>
                            <TableRow><TableCell>This Terminal</TableCell><TableCell>{apiCommodity.terminal_name}</TableCell></TableRow>
                            <TableRow><TableCell>Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell)}</TableCell></TableRow>
                            <TableRow><TableCell>Average Monthly Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell_avg_month)}</TableCell></TableRow>
                            <TableRow><TableCell>Average Weekly Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell_avg_week)}</TableCell></TableRow>
                            <TableRow><TableCell>Maximum Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell_max)}</TableCell></TableRow>
                            <TableRow><TableCell>Maximum Monthly Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell_max_month)}</TableCell></TableRow>
                            <TableRow><TableCell>Maximum Weekly Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell_max_week)}</TableCell></TableRow>
                            <TableRow><TableCell>Minimum Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell_min)}</TableCell></TableRow>
                            <TableRow><TableCell>Minimum Monthly Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell_min_month)}</TableCell></TableRow>
                            <TableRow><TableCell>Minimum Weekly Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell_min_week)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                    <Button onClick={() => setPopoverOpen(false)}>Close</Button>
                </TableContainer>
            </>
        );
    }

    const ratio = apiCommodity.price_sell / maxPriceCommodity.price_sell;
    console.log(ratio);

    return (
        <TableCell key={commodity.code} sx={{ bgcolor: ratio < 0.85 ? 'indianred' : ratio < 0.95 ? 'lightpink' : 'white' }}>
            {format.format(apiCommodity?.price_sell || 0)}

            <Tooltip title="More info">
                <IconButton size="small" onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                    setPopoverContent(getPopoverContent(apiCommodity));
                    setPopoverOpen(true);
                }}>
                    <InfoIcon sx={{ fontSize: 14 }} />
                </IconButton>
            </Tooltip>
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={() => setPopoverOpen(false)}
            >
                <Typography sx={{ p: 2 }}>{popoverContent}</Typography>
            </Popover>
        </TableCell>
    );
}
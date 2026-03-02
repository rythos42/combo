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
    TableHead,
    Button,
    Box,
    Divider
} from "@mui/material";
import InfoIcon from '@mui/icons-material/InfoOutline';
import { useState } from 'react';

export default function CommodityOutputCell({ commodity, commodities, maxPriceCommodity, acceptableProfitLossPerScu }) {
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
                        <TableHead>
                            <TableRow><TableCell>Highest Price</TableCell><TableCell>{maxPriceCommodity.terminal_name}</TableCell></TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow><TableCell>Sell Price</TableCell><TableCell>{format.format(maxPriceCommodity.price_sell)}</TableCell></TableRow>
                            <TableRow><TableCell>Profit Diff if Sold Here</TableCell><TableCell>{format.format((maxPriceCommodity.price_sell - apiCommodity.price_sell) * commodity.count)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                    <Table sx={{ marginTop: 2 }}>
                        <TableHead>
                            <TableRow><TableCell>One-Station Price</TableCell><TableCell>{apiCommodity.terminal_name}</TableCell></TableRow>
                        </TableHead>
                        <TableBody>
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

    return (
        <TableCell key={commodity.code} sx={{ bgcolor: (maxPriceCommodity.price_sell - apiCommodity.price_sell) > acceptableProfitLossPerScu ? 'lightpink' : 'white' }}>
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
                <Box sx={{ padding: 2 }}>{popoverContent}</Box>
            </Popover>
        </TableCell>
    );
}
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

export default function CommodityOutputCell({ commodity, commodities }) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverContent, setPopoverContent] = useState('Nothing');
    const [anchorEl, setAnchorEl] = useState(null);

    const apiCommodity = commodities.find(c => c.commodity_code === commodity.code);

    function getPopoverContent(apiCommodity) {
        return (
            <><Typography variant="h6">{apiCommodity.commodity_name} ({apiCommodity.commodity_code})</Typography>
                <TableContainer sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell><Typography>Terminal</Typography></TableCell><TableCell>{apiCommodity.terminal_name}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Average Monthly Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell_avg_month}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Average Weekly Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell_avg_week}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Maximum Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell_max}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Maximum Monthly Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell_max_month}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Maximum Weekly Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell_max_week}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Minimum Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell_min}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Minimum Monthly Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell_min_month}</TableCell></TableRow>
                            <TableRow><TableCell><Typography>Minimum Weekly Sell Price</Typography></TableCell><TableCell>{apiCommodity.price_sell_min_week}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                    <Button onClick={() => setPopoverOpen(false)}>Close</Button>
                </TableContainer>
            </>
        );
    }

    return (
        <TableCell key={commodity.code}>
            {apiCommodity?.price_sell || 'N/A'}
            <Tooltip title="More info">
                <IconButton size="small" onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                    setPopoverContent(getPopoverContent(apiCommodity));
                    setPopoverOpen(true);
                }}>
                    <InfoIcon />
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
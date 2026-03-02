'use client'

import {
    TableCell,
    IconButton,
    Popover,
    Typography,
    Table,
    TableBody,
    TableRow,
    TableContainer,
    Button,
    Tooltip,
    Box,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/InfoOutline';
import { useState } from 'react';

export default function CommodityHeaderCell({ commodity, apiCommodity }) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverContent, setPopoverContent] = useState('Nothing');
    const [anchorEl, setAnchorEl] = useState(null);
    const format = new Intl.NumberFormat('en-US');

    function getPopoverContent(apiCommodity) {
        return (
            <>
                <Typography variant="h6">Max Price for {apiCommodity.commodity_name} ({apiCommodity.commodity_code})</Typography>
                <TableContainer sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell>Terminal</TableCell><TableCell>{apiCommodity.terminal_name}</TableCell></TableRow>
                            <TableRow><TableCell>Sell Price</TableCell><TableCell>{format.format(apiCommodity.price_sell)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                    <Button onClick={() => setPopoverOpen(false)}>Close</Button>
                </TableContainer>
            </>
        );
    }

    return (
        <TableCell key={commodity.code}>
            {commodity.code} ({commodity.count} scu)

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
                <Box sx={{ padding: 2 }}>
                    {popoverContent}
                </Box>
            </Popover>
        </TableCell>
    );
}
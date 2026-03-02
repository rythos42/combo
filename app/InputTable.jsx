'use client'

import {
    Table,
    TextField,
    TableBody,
    TableRow,
    TableCell,
    Button,
    IconButton,
    TableContainer,
    Paper,
    TableHead,
    Typography,
    Autocomplete,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function InputTable() {
    const emptySessionData = {
        rows: [],
        acceptableProfitLossPerScu: 750
    };

    const [sessionData, setSessionData] = useState(emptySessionData);
    const [focus, setFocus] = useState(false);
    const router = useRouter();
    const lastFieldRef = useRef(null);

    const commodityCodeOptions = [
        'ACCO',
        'AGRI',
        'AGRS',
        'ALUM',
        'AMIP',
        'AMMO',
        'APHO',
        'ARGO',
        'ASTA',
        'ATLA',
        'AUDI',
        'AUTR',
        'BERA',
        'BERY',
        'BEXA',
        'BIOPL',
        'BORA',
        'CARB',
        'CARI',
        'CAVEK',
        'CHLO',
        'CK13',
        'CMAT',
        'COBA',
        'COMP',
        'COPP',
        'CORU',
        'CSIL',
        'DCSR',
        'DECA',
        'DEGR',
        'DIAL',
        'DIAM',
        'DIST',
        'DOLI',
        'DYMA',
        'DYNF',
        'ETAM',
        'FEYN',
        'FFOO',
        'FLUO',
        'FOAM',
        'GAWE',
        'GLAC',
        'GOLD',
        'GOLM',
        'HADA',
        'HELI',
        'HEPH',
        'HFBA',
        'HOTW',
        'HPMC',
        'HYDF',
        'HYDR',
        'IKOP',
        'IODI',
        'IRON',
        'JACL',
        'JANA',
        'KOPH',
        'KRYP',
        'LARA',
        'LIND',
        'LUMG',
        'MARG',
        'MAZE',
        'MEDS',
        'MERC',
        'METH',
        'NEOG',
        'NEON',
        'NITR',
        'OMPO',
        'ORGN',
        'OSOH',
        'PART',
        'PFOO',
        'PICE',
        'PITA',
        'POTA',
        'PROT',
        'PRTL',
        'QFUE',
        'QUAN',
        'QUAR',
        'RAND',
        'REVE',
        'REVP',
        'RICC',
        'RMC',
        'SAVR',
        'SCRA',
        'SHPA',
        'SILI',
        'SLAM',
        'SOUV',
        'STEE',
        'STIL',
        'STIM',
        'SUNB',
        'TARA',
        'TIN',
        'TITA',
        'TORI',
        'TRIT',
        'TUNG',
        'WAST',
        'WIDO',
        'XAPY',
        'YTPO'
    ];

    useEffect(() => {
        const sessionDataString = sessionStorage.getItem('data')
        if (!sessionDataString)
            return;

        try {
            let newSessionData = JSON.parse(sessionDataString);
            if (Array.isArray(newSessionData)) {    // migrate from old data format
                newSessionData = {
                    ...emptySessionData,
                    rows: newSessionData
                };
            }

            setSessionData(newSessionData);
        } catch (error) {
            setSessionData(emptySessionData);
            sessionStorage.setItem('data', JSON.stringify(emptySessionData));
        }
    }, [])

    useEffect(() => {
        if (!focus)
            return;

        setFocus(false);
        const lastField = lastFieldRef.current?.querySelector('input');
        lastField?.focus();
        lastField?.select();
    }, [sessionData.rows])

    function addInputRow() {
        const newRows = [...sessionData.rows, { code: 'ACCO', count: '', displayCount: '' }];
        setFocus(true);
        const newData = { ...sessionData, rows: newRows };
        setSessionData(newData);
        sessionStorage.setItem('data', JSON.stringify(newData));
    }

    function handleCodeChange(index, value) {
        const newRows = [...sessionData.rows];
        newRows[index].code = value;
        const newData = { ...sessionData, rows: newRows };
        setSessionData(newData);
        sessionStorage.setItem('data', JSON.stringify(newData));
    }

    function handleCountChange(index, value) {
        const newRows = [...sessionData.rows];

        const values = value.split(',').map(v => v == '' ? 0 : parseInt(v.trim()));
        const count = values.length > 1 ? values.reduce((a, b) => a + b, 0) : value;

        newRows[index].count = count;
        newRows[index].displayCount = value;
        const newData = { ...sessionData, rows: newRows };
        setSessionData(newData);
        sessionStorage.setItem('data', JSON.stringify(newData));
    }

    function handleProfitLossPerScuChange(event) {
        const value = event.target.value;
        const newData = { ...sessionData, acceptableProfitLossPerScu: value };
        setSessionData(newData);
        sessionStorage.setItem('data', JSON.stringify(newData));
    }

    function handleDeleteRow(index) {
        const newRows = [...sessionData.rows];
        newRows.splice(index, 1);
        const newData = { ...sessionData, rows: newRows };
        setSessionData(newData);
        sessionStorage.setItem('data', JSON.stringify(newData));
    }

    function generateTable() {
        router.push(`/?data=${encodeURIComponent(JSON.stringify(sessionData))}`);
    }

    return (
        <Paper sx={{ maxWidth: 600, margin: 'auto', marginTop: 5, padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Commodity Combos
            </Typography>
            <TableContainer sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Commodity Code</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessionData.rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Autocomplete
                                        autoComplete={true}
                                        autoSelect={true}
                                        autoHighlight={true}
                                        selectOnFocus={true}
                                        clearOnBlur={true}
                                        options={commodityCodeOptions}
                                        fullWidth
                                        renderInput={(params) =>
                                            <TextField {...params}
                                                ref={index === sessionData.rows.length - 1 ? lastFieldRef : null} />}
                                        onChange={(_, newValue) => handleCodeChange(index, newValue)}
                                        value={row.code}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Count"
                                        value={row.displayCount}
                                        placeholder='1 OR (1, 2, 3)'
                                        onChange={(e) => handleCountChange(index, e.target.value)} />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDeleteRow(index)}
                                        tabIndex={-1}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box sx={{ marginTop: 2 }}>
                    <TextField
                        label="Acceptable Profit/Loss per Scu"
                        value={sessionData.acceptableProfitLossPerScu}
                        onChange={handleProfitLossPerScuChange}
                        slotProps={{
                            htmlInput: {
                                tabIndex: -1,
                            },
                        }}
                    />
                    <Button onClick={addInputRow}>Add</Button>
                    <Button
                        variant="contained"
                        onClick={generateTable}
                    >
                        Generate
                    </Button>
                </Box>
            </TableContainer>
        </Paper >
    );
}
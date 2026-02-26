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
    Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function InputTable() {
    const [inputRows, setInputRows] = useState([]);
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
            const sessionData = JSON.parse(sessionDataString);
            setInputRows(sessionData);
        } catch (error) {
            setInputRows([]);
            sessionStorage.setItem('data', [])
        }
    }, [])

    useEffect(() => {
        if (!focus)
            return;

        setFocus(false);
        const lastField = lastFieldRef.current?.querySelector('input');
        lastField?.focus();
        lastField?.select();
    }, [inputRows])

    function addInputRow() {
        const newInputRows = [...inputRows, { code: 'ACCO', count: '', displayCount: '' }];
        setFocus(true);
        setInputRows(newInputRows);
        sessionStorage.setItem('data', newInputRows);
    }

    function handleCodeChange(index, value) {
        const newInputRows = [...inputRows];
        newInputRows[index].code = value;
        setInputRows(newInputRows);
        sessionStorage.setItem('data', JSON.stringify(newInputRows));
    }

    function handleCountChange(index, value) {
        const newInputRows = [...inputRows];

        const values = value.split(',').map(v => v == '' ? 0 : parseInt(v.trim()));
        const count = values.length > 1 ? values.reduce((a, b) => a + b, 0) : value;

        newInputRows[index].count = count;
        newInputRows[index].displayCount = value;
        setInputRows(newInputRows);
        sessionStorage.setItem('data', JSON.stringify(newInputRows));
    }

    function handleDeleteRow(index) {
        const newInputRows = [...inputRows];
        newInputRows.splice(index, 1);
        setInputRows(newInputRows);
        sessionStorage.setItem('data', JSON.stringify(newInputRows));
    }

    function generateTable() {
        router.push(`/?data=${encodeURIComponent(JSON.stringify(inputRows))}`);
    }

    return (
        <>
            <Typography variant="h4" align="left" gutterBottom>
                Commodity Combos
            </Typography>
            <TableContainer component={Paper} sx={{ width: 650, margin: 'auto', marginTop: 5 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Commodity Code</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inputRows.map((row, index) => (
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
                                                ref={index === inputRows.length - 1 ? lastFieldRef : null} />}
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
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell>
                                <Button onClick={addInputRow}>Add</Button>
                                <Button
                                    variant="contained"
                                    onClick={generateTable}
                                >
                                    Generate
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer >
        </>
    );
}
import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    Paper,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { glossaryTerms } from '../data/glossary/terms';

const TermCard = ({ term }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper
            elevation={3}
            sx={{
                p: isMobile ? 1.5 : 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6]
                }
            }}
        >
            <Typography
                variant="h6"
                color="primary"
                sx={{
                    fontWeight: 700,
                    fontSize: isMobile ? '1rem' : '1.15rem'
                }}
            >
                {term.term}
            </Typography>

            <Typography variant="body2" color="text.secondary">
                {term.definition}
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 600 }}>
                Syntax:
            </Typography>
            <Box
                component="pre"
                sx={{
                    background: theme.palette.grey[100],
                    p: 1,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    overflowX: 'auto'
                }}
            >
                <code>{term.syntax}</code>
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 600 }}>
                Example:
            </Typography>
            <Box
                component="pre"
                sx={{
                    background: theme.palette.grey[100],
                    p: 1,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    overflowX: 'auto'
                }}
            >
                <code>{term.example}</code>
            </Box>
        </Paper>
    );
};

export default function GlossaryPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchTerm, setSearchTerm] = useState('');

    const groupedTerms = useMemo(() => {
        return glossaryTerms.reduce((acc, term) => {
            const category = term.category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(term);
            return acc;
        }, {});
    }, []);

    const filteredGroupedTerms = useMemo(() => {
        if (!searchTerm) return groupedTerms;
        const filtered = {};
        for (const category in groupedTerms) {
            const terms = groupedTerms[category].filter(term =>
                term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                term.syntax.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (terms.length > 0) filtered[category] = terms;
        }
        return filtered;
    }, [searchTerm, groupedTerms]);

    const categories = Object.keys(filteredGroupedTerms);

    return (
        <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 3 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', mb: 3, fontSize: isMobile ? '1.6rem' : '2.2rem' }}
            >
                📘 SQL Glossary & Cheatsheet
            </Typography>

            <TextField
                fullWidth
                placeholder="Search terms (e.g., SELECT, JOIN, CREATE...)"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                    mb: 4,
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1
                }}
            />

            {categories.length > 0 ? (
                categories.map((category, index) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.07 }}
                    >
                        <Accordion
                            defaultExpanded
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                boxShadow: theme.shadows[1],
                                overflow: 'hidden'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    bgcolor: theme.palette.background.paper,
                                    px: 2,
                                    py: 1.5
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: isMobile ? '1rem' : '1.1rem' }}>
                                        {category}
                                    </Typography>
                                    <Chip
                                        label={`${filteredGroupedTerms[category].length} term${filteredGroupedTerms[category].length > 1 ? 's' : ''}`}
                                        size="small"
                                        color="primary"
                                    />
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails sx={{ p: isMobile ? 1 : 2 }}>
                                <Grid container spacing={2}>
                                    {filteredGroupedTerms[category].map(term => (
                                        <Grid item xs={12} sm={6} md={4} key={term.term}>
                                            <TermCard term={term} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </motion.div>
                ))
            ) : (
                <Box
                    sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: theme.palette.background.paper
                    }}
                >
                    <Typography color="text.secondary" fontSize="1rem">
                        No terms found matching your search.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

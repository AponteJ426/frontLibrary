// FiltrosModal.tsx
import { useState } from 'react';
import { Modal, Box, Typography, Button, FormControlLabel, Checkbox, Slider, Divider, Switch } from '@mui/material';

const FiltrosModal = ({ open, onClose, filtros, setFiltros, buscarPorLetra, setBuscarPorLetra, letraSeleccionada, setLetraSeleccionada }) => {
    const [tempFiltros, setTempFiltros] = useState(filtros);
    const letras = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

    const handleChange = (e) => {
        setTempFiltros({
            ...tempFiltros,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckbox = (e) => {
        setTempFiltros({
            ...tempFiltros,
            [e.target.name]: e.target.checked
        });
    };

    const aplicarFiltros = () => {
        setFiltros(tempFiltros);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 500 },
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                maxHeight: '90vh',
                overflowY: 'auto',
            }}>
                <Typography variant="h6" gutterBottom>
                    Filtros Avanzados
                </Typography>

                <div className="space-y-6">
                    {/* Opción de buscar por letra */}
                    <div>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={buscarPorLetra}
                                    onChange={() => setBuscarPorLetra(!buscarPorLetra)}
                                    color="primary"
                                />
                            }
                            label="Buscar por letra inicial del título"
                        />

                        {buscarPorLetra && (
                            <div className="mt-4">
                                <Typography variant="subtitle2" gutterBottom>
                                    Seleccione letra inicial:
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {letras.map((letra) => (
                                        <button
                                            key={letra}
                                            onClick={() => setLetraSeleccionada(letra)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                        ${letraSeleccionada === letra ? 'bg-cyan-500 text-white' : 'bg-gray-100'}`}
                                        >
                                            {letra}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setLetraSeleccionada('')}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                      ${letraSeleccionada === '' ? 'bg-cyan-500 text-white' : 'bg-gray-100'}`}
                                    >
                                        #
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Divider />

                    {/* Filtros por año */}

                    {/* Otros filtros */}
                    <div className="space-y-2">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={tempFiltros.soloDisponibles || false}
                                    onChange={handleCheckbox}
                                    name="soloDisponibles"
                                />
                            }
                            label="Solo libros disponibles"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={tempFiltros.soloConImagen || true}
                                    onChange={handleCheckbox}
                                    name="soloConImagen"
                                />
                            }
                            label="Solo libros con imagen"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setTempFiltros(filtros);
                                onClose();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={aplicarFiltros}
                            color="primary"
                        >
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};
export default FiltrosModal;
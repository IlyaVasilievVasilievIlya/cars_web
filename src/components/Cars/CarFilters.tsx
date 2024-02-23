import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { brandModelsStore } from "../../store/brandModelsStore";


interface CarFiltersProps {
    filterCar: (car: string) => void;
    filterColor: (color: string) => void;
    filterBrand: (brand: string) => void;
    filterModel: (model: string) => void;
}

export const CarFilters: React.FC<CarFiltersProps> = ({ filterCar, filterColor, filterBrand, filterModel }) => {

    const modelList = Array.from(new Set(brandModelsStore.brandModels.map(model => model.model)));

    const brandList = Array.from(new Set(brandModelsStore.brandModels.map(model => model.brand)));
    
    const [color, setColor] = useState('');
    const [car, setCar] = useState('');

    function setColorFilter(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const value = e.target.value as string;
        setColor(value);
        filterColor(value);
    }

    function setCarFilter(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const value = e.target.value as string;
        setCar(value);
        filterCar(value);
    }

    return (
        <Box component="section" sx={{p: 2}}>
            <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item sm={3} xs={12}>
                    <TextField
                        type="search"
                        label="Цвет машины"
                        fullWidth
                        autoComplete="off"
                        value={color}
                        onChange={(e) => setColorFilter(e)} />
                </Grid>
                <Grid item sm={3} xs={12}>
                    <TextField
                        type="search"
                        label="Поиск по машине"
                        fullWidth
                        autoComplete="off"
                        value={car}
                        onChange={(e) => setCarFilter(e)} />
                </Grid>
                <Grid item sm={3} xs={12}>
                    <Autocomplete
                        options={brandList}
                        fullWidth
                        onInputChange={(_, newInputValue) => {
                            filterBrand(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Бренд" />} />
                </Grid>
                <Grid item sm={3} xs={12}>
                    <Autocomplete
                        options={modelList}
                        fullWidth
                        onInputChange={(_, newInputValue) => {
                            filterModel(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Марка" />} />
                </Grid>
            </Grid>
        </Box>
    )
}
import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import { brandModelsStore } from "../../store/brandModelsStore";
import { debounce } from "../../common/functions";
import { ChangeEvent, useCallback, useMemo, useState } from "react";


interface CarFiltersProps {
    filterCar: (car: string) => void;
    filterColor: (color: string) => void;
    filterBrand: (brand: string) => void;
    filterModel: (model: string) => void;
}

export const CarFilters: React.FC<CarFiltersProps> = ({ filterCar, filterColor, filterBrand, filterModel }) => {

    const modelList = Array.from(new Set(brandModelsStore.brandModels.map(model => model.model)));

    const brandList = Array.from(new Set(brandModelsStore.brandModels.map(model => model.brand)));

    const filterColorDebounce = useCallback(debounce(filterColor, 200), [filterColor]);
    const filterCarDebounce = useMemo(() => debounce(filterCar, 200), [filterCar]);
    const filterBrandDebounce = useMemo(() => debounce(filterBrand, 200), [filterBrand]);
    const filterModelDebounce = useMemo(() => debounce(filterModel, 200), [filterModel]);
    
    const [color, setColor] = useState('');
    const [car, setCar] = useState('');

    function setColorFilter(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const value = e.target.value as string;
        setColor(value);
        filterColorDebounce(value);
    }

    function setCarFilter(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const value = e.target.value as string;
        setCar(value);
        filterCarDebounce(value);
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
                            filterBrandDebounce(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Бренд" />} />
                </Grid>
                <Grid item sm={3} xs={12}>
                    <Autocomplete
                        options={modelList}
                        fullWidth
                        onInputChange={(_, newInputValue) => {
                            filterModelDebounce(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Марка" />} />
                </Grid>
            </Grid>
        </Box>
    )
}
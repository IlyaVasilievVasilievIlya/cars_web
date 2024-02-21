import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import { brandModelsStore } from "../../store/brandModelsStore";
import { debounce } from "../../common/functions";
import { ChangeEvent, useCallback, useMemo, useState } from "react";


interface CarFiltersProps {
    filterCar: React.MutableRefObject<(car: string) => void>;
    filterColor: React.MutableRefObject<(color: string) => void>;
    filterBrand: React.MutableRefObject<(brand: string) => void>;
    filterModel: React.MutableRefObject<(model: string) => void>;
}

export const CarFilters: React.FC<CarFiltersProps> = ({ filterCar, filterColor, filterBrand, filterModel }) => {

    const modelList = Array.from(new Set(brandModelsStore.brandModels.map(model => model.model)));

    const brandList = Array.from(new Set(brandModelsStore.brandModels.map(model => model.brand)));
    
    const [color, setColor] = useState('');
    const [car, setCar] = useState('');

    function setColorFilter(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const value = e.target.value as string;
        setColor(value);
        filterColor.current(value);
    }

    function setCarFilter(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const value = e.target.value as string;
        setCar(value);
        filterCar.current(value);
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
                            filterBrand.current(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Бренд" />} />
                </Grid>
                <Grid item sm={3} xs={12}>
                    <Autocomplete
                        options={modelList}
                        fullWidth
                        onInputChange={(_, newInputValue) => {
                            filterModel.current(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Марка" />} />
                </Grid>
            </Grid>
        </Box>
    )
}
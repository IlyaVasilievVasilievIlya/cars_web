import { Autocomplete, Box, Grid, MenuItem, Select, TextField } from "@mui/material"
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

    return (
        <Box component="section" sx={{p: 2}}>
            <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item sm={3} xs={12}>
                    <TextField
                        type="search"
                        label="Цвет машины"
                        fullWidth
                        autoComplete="false"
                        defaultValue=''
                        onChange={(e) => filterColor((e.target.value as string))} />
                </Grid>
                <Grid item sm={3} xs={12}>
                    <TextField
                        type="search"
                        label="Поиск по машине"
                        fullWidth
                        autoComplete="false"
                        defaultValue=''
                        onChange={(e) => filterCar((e.target.value as string))} />
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
import { Box, MenuItem, Select, TextField } from "@mui/material"
import { brandModelsStore } from "../../store/brandModelsStore";
import { useState } from "react";


interface CarFiltersProps {
    filterCar: (car: string) => void;
    filterColor: (color: string) => void;
    filterBrand: (brand: string) => void;
    filterModel: (model: string) => void;
}

export const CarFilters: React.FC<CarFiltersProps> = ({ filterCar, filterColor, filterBrand, filterModel }) => {

    const modelList = Array.from(new Set(brandModelsStore.brandModels.map(model => model.model))).map((elem, index) =>

        <MenuItem key={index} value={elem}>
            {elem}
        </MenuItem>);

    const brandList = Array.from(new Set(brandModelsStore.brandModels.map(model => model.brand))).map((elem, index) =>
        <MenuItem key={index} value={elem}>
            {elem}
        </MenuItem>);

    brandList.unshift(<MenuItem key={-1} value=''>none</MenuItem>)

    modelList.unshift(<MenuItem key={-1} value=''>none</MenuItem>)


    return (
        <Box component="section">
            <TextField
                type="search"
                label="Цвет машины"
                defaultValue={''}
                onChange={(e) => filterColor((e.target.value as string))} />
            <TextField
                type="search"
                label="Поиск по машине"
                defaultValue={''}
                onChange={(e) => filterCar((e.target.value as string))} />
            <Select labelId="Бренд" label="Бренд" placeholder="Выберите бренд"
                id="filter-select1"
                value={''}
                onChange={(e) => filterBrand((e.target.value as string))}>
                {brandList}
            </Select>
            <Select labelId="Марка" label="Марка" placeholder="Выберите марку"
                id="filter-select2"
                value={''}
                onChange={(e) => filterModel((e.target.value as string))}>
                {modelList}
            </Select>
        </Box>
    )
}
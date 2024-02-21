import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Box, Card, CardActions, CardContent, IconButton, Typography } from '@mui/material';
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ROLES } from "../../common/roles";
import { authStore } from "../../store/authStore";
import { basketStore } from "../../store/basketStore";
import { Car } from "../model";


interface CarListItemProps {
    car: Car
    openEdit: (id: number) => void
    openDelete: (id: number) => void
}

export const CarListItem: React.FC<CarListItemProps> = observer(({ car, openDelete, openEdit }: CarListItemProps) => {

    const [isInBasket, setInBasket] = useState(basketStore.contains(car.carId));

    function toggleAdd() {
        setInBasket(!isInBasket);
        if (!isInBasket) {
            basketStore.addProduct({ id: car.carId, name: `${car.brand.brand} ${car.brand.model} ${car.color}`, count: 1 })
        } else {
            basketStore.deleteProduct(car.carId);
        }
    }

    return (
        <Card key={car.carId} sx={{ borderRadius: 3, marginTop: 1 }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant={"body1"}>
                        {car.brand.brand} {car.brand.model}
                    </Typography>
                    <Typography variant={"body2"}>
                        {car.color}
                    </Typography>
                </Box>
                <CardActions>
                    {authStore.checkRole([ROLES.Manager, ROLES.Admin, ROLES.SuperUser]) &&
                        <>
                            <IconButton onClick={() => openEdit(car.carId)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => openDelete(car.carId)}>
                                <DeleteIcon />
                            </IconButton>
                        </>}
                    <IconButton onClick={() => toggleAdd()}>
                        {(basketStore.contains(car.carId)) ? <RemoveShoppingCartIcon />
                            : <AddShoppingCartIcon />}
                    </IconButton>
                </CardActions>
            </CardContent>
        </Card>
    )
});
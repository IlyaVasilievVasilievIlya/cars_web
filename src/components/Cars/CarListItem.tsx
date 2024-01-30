import { basketStore } from "../../store/basketStore";
import { Delete } from "@mui/icons-material";
import { Car } from "../model";
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { authStore } from "../../store/authStore";
import { ROLES } from "../../public/consts";
import { useState } from "react";
import { observer } from "mobx-react-lite";


interface CarListItemProps {
    car: Car
    openEdit: (id: number) => void
    openDelete: (id: number) => void
}

export const CarListItem: React.FC<CarListItemProps> = observer(({ car, openDelete, openEdit }: CarListItemProps) => {

    const [isInBasket, setInBasket] = useState(false);


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
                        </>
                    }
                    <IconButton onClick={() => toggleAdd()}>
                        {(basketStore.contains(car.carId)) ? <RemoveShoppingCartIcon />
                            : <AddShoppingCartIcon />}
                    </IconButton>
                </CardActions>
            </CardContent>
        </Card>
    )
});
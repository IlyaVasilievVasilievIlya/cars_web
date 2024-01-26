import { Button, IconButton, ListItem, Typography } from "@mui/material";
import { basketStore } from "../../store/basketStore";
import { Delete } from "@mui/icons-material";

interface BasketListItemProps {
    count: number;
    name: string;
    id: number;
}

export const BasketListItem: React.FC<BasketListItemProps> = ({ count, name, id }: BasketListItemProps) => {
    return (
        <ListItem>
            <Typography>
                {name}
            </Typography>
            <Button onClick={() => basketStore.incrementCount(id)} disabled={count > 99}>+</Button>
            <Typography>
                {count}
            </Typography>
            <Button onClick={() => basketStore.decrementCount(id)} disabled={count < 2}>-</Button>
            <IconButton onClick={() => { basketStore.deleteProduct(id); }}><Delete /></IconButton>
        </ListItem>
    )
}
import { Typography } from "@mui/material"
import { Header } from "../components/Header"
import { authStore } from "../store/authStore"

export const Unauthorized: React.FC = () => {
    return (
        <>
            <Header />
            {authStore.userRole}
            <Typography variant="h2" position={'fixed'} top={'50%'} left={'50%'} style={{ transform: `translate(-50%,-50%)` }} noWrap>youre not allowed to be here</Typography>
        </>
    )
}
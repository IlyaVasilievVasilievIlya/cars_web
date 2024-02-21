import { Typography } from '@mui/material';
import { Header } from '../components/Header';

export function NotFoundPage() {

    return (
        <>
            <Header />
            <Typography variant='h2' position={'fixed'} top={'50%'} left={'50%'} style={{ transform: `translate(-50%,-50%)` }} noWrap>page not found</Typography>
        </>
    );
}
import { Box, Typography } from '@mui/material';
import { Header } from '../components/Header';

export function HomePage() {

  return (
    <>
      <Header />
      <Box sx={{display:"flex", justifyContent:"center", marginTop:"500px"}}>
        <Typography variant={"h2"} fontFamily={"fantasy"}>
          Home Page
        </Typography>
      </Box>
    </>
  );
}
/* eslint-disable max-len */
import {Helmet} from 'react-helmet-async';
import {Container, Grid} from '@mui/material';
import ChainDouble from '../../components/ChainDouble';

export const HomePage = () => (
  <Container maxWidth='lg'>
    <Helmet>
      <title>Home Page</title>
      <meta name='description' content='A Boilerplate application homepage' />
    </Helmet>

    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <span>ChainDouble</span>
      </Grid>
    </Grid>

    <br />
    <ChainDouble />
  </Container>
);

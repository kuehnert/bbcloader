import React from 'react';
import Status from '../components/Status';
import AddVideo from '../components/AddVideo';
import VideoList from '../components/VideoList';
import { makeStyles } from '@material-ui/styles';
import { Grid, Container, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  card: { minWidth: 275 },
  page: { padding: '20px' },
});

export default function VideosPage() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.page}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2" color="secondary">
						<img src="/media/BBCWorldService512.png" alt="Logo" width="64" height="64" />{' '}
            BBC-Downloader
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Status />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" color="primary">
            Add a New Download
          </Typography>
          <AddVideo />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" color="primary">
            Download list
          </Typography>
          <VideoList />
        </Grid>
      </Grid>
    </Container>
  );
}

/*
			<div className="row">
                <h2>Finished videos</h2>
                <VideoList videos={this.props.completed} />
            </div>
*/

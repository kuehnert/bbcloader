import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus } from '../actions';
import { Grid, Card, CardHeader, CardContent, withStyles } from '@material-ui/core';

const format = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const styles = {
  card: { backgroundColor: '#4448' },
  page: { padding: '20px' },
};

export class Status extends Component {
  componentDidMount() {
    this.props.getStatus();
  }

  render() {
    const { classes } = this.props;
    const { externalIP, isOnline, currentVideo, lastUpdate } = this.props.status;
    if (!lastUpdate) return <div>Loading...</div>;
    const lastUpdateStr = format.format(new Date(lastUpdate));

    return (
      <Grid container spacing={3} justify="space-evenly">
        <Grid item xs={3}>
          <Card className={classes.card}>
            <CardHeader title="External IP" />
            <CardContent>{externalIP}</CardContent>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card className={classes.card}>
            <CardHeader title="Online" />
            <CardContent>{isOnline ? '✔' : '❌'}</CardContent>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card className={classes.card}>
            <CardHeader title="Current Download" />
            <CardContent>{currentVideo ? currentVideo.filename : '– none –'}</CardContent>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card className={classes.card}>
            <CardHeader title="Last Update" />
            <CardContent>{lastUpdateStr}</CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  status: state.status,
});

const mapDispatchToProps = { getStatus };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Status));

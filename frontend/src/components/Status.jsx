import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus } from '../actions';
import { Grid, Card, CardHeader, CardContent, withStyles, CircularProgress, Typography } from '@material-ui/core';

const format = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const styles = theme => ({
  card: { backgroundColor: '#4448' },
  greenCard: { backgroundColor: '#2828' },
  page: { padding: '20px' },
  progress: { spacing: theme.spacing(2) },
  content: { textAlign: 'center', padding: 0 },
});

const loading = classes => <CircularProgress className={classes.progress} color="secondary" size={26} />;

const renderContent = (title, condition, content, classes) => (
  <Grid item xs={3}>
    <Card className={condition ? classes.greenCard : classes.card}>
      <CardHeader title={title} />
      <CardContent className={classes.content}>
        {condition ? <Typography variant="h6">{content}</Typography> : loading(classes)}
      </CardContent>
    </Card>
  </Grid>
);

export class Status extends Component {
  componentDidMount() {
    this.props.getStatus();
  }

  render() {
    const { classes } = this.props;
    const { externalIP, isOnline, currentVideo, lastUpdate } = this.props.status;
    const lastUpdateStr = lastUpdate && format.format(new Date(lastUpdate));
    const downloadStr = currentVideo ? currentVideo.filename : '– none –';

    return (
      <Grid container spacing={2} justify="space-evenly">
        {renderContent('External IP', externalIP, externalIP, classes)}
        {renderContent('Online', externalIP, isOnline ? '✔' : '❌', classes)}
        {renderContent('Last Update', lastUpdate, lastUpdateStr, classes)}
        {renderContent('Current Download', externalIP, downloadStr, classes)}
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

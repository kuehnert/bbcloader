import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getVideos } from '../actions';
import Video from './Video';
import { TableHead, Paper, Table, TableRow, TableBody, TableFooter, TableCell } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(3),
    overflowX: 'auto',
    backgroundColor: '#4448',
  },
  table: {},
});

class VideoList extends Component {
  componentDidMount() {
    this.props.getVideos();
  }

  render() {
    const { videos, classes } = this.props;

    if (videos.length === 0) {
      return <div>Currently, there are no videos in the download queue.</div>;
    } else {
      const videoRows = videos.map(video => {
        return <Video video={video} key={video.id} />;
      });

      return (
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell component="th">Programme</TableCell>
                <TableCell component="th">Series</TableCell>
                <TableCell component="th">Episode</TableCell>
                <TableCell component="th">Title</TableCell>
                <TableCell component="th">Tagged?</TableCell>
                <TableCell component="th">Attempts</TableCell>
                <TableCell component="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{videoRows}</TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <b>{videos.length}</b> Videos on download list
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      );
    }
  }
}

const mapStateToProps = state => ({
  videos: Object.values(state.videos),
});

export default connect(
  mapStateToProps,
  { getVideos }
)(withStyles(styles)(VideoList));

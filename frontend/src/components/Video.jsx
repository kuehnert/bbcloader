import React, { Component } from 'react';
import history from '../history';
import './Video.css';
import { connect } from 'react-redux';
import { deleteVideo } from '../actions';
import { TableRow, TableCell, Button, Link, withStyles } from '@material-ui/core';

class Video extends Component {
  renderSeriesEpisode({ id, programme, series, episodeNumber, episodeTitle, url }) {
    if (programme && series >= 0) {
      return (
        <>
          <TableCell>
            <Link href={url} target="new" onClick={e => e.stopPropagation()}>
              {programme}
            </Link>
          </TableCell>
          <TableCell className="right">{series}</TableCell>
          <TableCell className="right">{episodeNumber}</TableCell>
          <TableCell>{episodeTitle}</TableCell>
        </>
      );
    } else if (programme) {
      return (
        <>
          <TableCell colSpan={4}>
            <Link to={`/videos/edit/${id}`}>{programme}</Link>
          </TableCell>
        </>
      );
    } else {
      return (
        <>
          <TableCell colSpan={4}>
            <Link to={`/videos/edit/${id}`}>{url}</Link>
          </TableCell>
        </>
      );
    }
  }

  render() {
    const { classes, video } = this.props;
    const { id, attempts, tagged } = video;

    return (
      <TableRow onClick={() => history.push(`/videos/edit/${id}`)} className={classes.row}>
        {this.renderSeriesEpisode(this.props.video)}
        <TableCell>{tagged ? '✔' : '❌'}</TableCell>
        <TableCell className="right">{attempts}</TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={event => {
              event.stopPropagation();
              this.props.deleteVideo(id);
            }}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
    );
  }
}

const styles = {
  row: {
    '&:hover': { cursor: 'pointer' },
  },
};

const mapDispatchToProps = {
  deleteVideo,
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Video));

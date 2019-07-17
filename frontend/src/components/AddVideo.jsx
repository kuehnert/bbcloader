import React, { Component } from 'react';
import validator from 'validator';
import { connect } from 'react-redux';
import { createVideo } from '../actions';
import { Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

class AddVideo extends Component {
  initialState = { message: 'Drag & drop URL here', bgcolor: '#4448', border: '8px yellow' };
  state = { ...this.initialState };

  onDragOver = event => {
    if (event.preventDefault) {
      event.preventDefault();
    }

    return false;
  };

  onDragEnter = event => {
    this.setState({ message: 'Drop here!', bgcolor: '#4448', border: '8px dashed red' });
  };

  onDragLeave = event => {
    this.setState(this.initialState);
  };

  onDrop = async event => {
    event.preventDefault();
    const url = event.dataTransfer.getData('text');

    if (validator.isURL(url) && url.match(/bbc\.co\.uk/)) {
      this.props.createVideo(url);

      this.setState({ message: 'Video(s) added.', bgcolor: '#2f28', border: '8px solid green' });
    } else {
      this.setState({ message: 'URL not usuable', bgcolor: '#f228' });
    }

    setTimeout(() => {
      this.setState(this.initialState);
    }, 2000);
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper
        className={classes.dropzone}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        style={{ backgroundColor: this.state.bgcolor, border: this.state.border }}>
				<Typography variant="h5" component="h2" color="primary" align="center">
          {this.state.message}
        </Typography>
      </Paper>
    );
  }
}

const styles = theme => ({
  dropzone: {
    padding: theme.spacing(3, 2),
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '20px',
    marginBottom: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
	},
});

export default connect(
  null,
  { createVideo }
)(withStyles(styles)(AddVideo));

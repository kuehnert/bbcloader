import React, { Component } from 'react';
import validator from 'validator';
import backend from '../api/backend';
import './AddVideo.css';

class AddVideo extends Component {
  state = { message: 'Drop URL here.', bgcolor: '#ebebeb' };

  onDragOver = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  onDragEnter = event => {
    event.stopPropagation();
    this.setState({ message: 'Drop here.', bgcolor: '#ffffdd' });
  };

  onDrop = async event => {
    event.preventDefault();
    event.stopPropagation();
    console.log('onFileDrop');

    const data = event.dataTransfer.getData('text');

    if (validator.isURL(data) && data.match(/bbc\.co\.uk/)) {
      console.log('AddVideo data: ', data);
      const result = await backend.post('/videos', { url: data });
      console.log("AddVideo result: ", result);

      this.setState({ message: 'Video(s) added.', bgcolor: '#ccffcc' });
      this.props.callBack();
      setTimeout(() => {
        this.setState({ message: 'Drop URL here.', bgcolor: '#ebebeb' });
      }, 1000);
    } else {
      this.setState({ message: 'URL not usuable', bgcolor: 'red' });
    }
  };

  render() {
    return (
      <div
        className="dropzone"
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        style={{ backgroundColor: this.state.bgcolor }}>
        {this.state.message}
      </div>
    );
  }
}

export default AddVideo;

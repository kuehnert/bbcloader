import React, { Component } from "react";
import validator from "validator";
import { connect } from "react-redux";
import { createVideo } from "../actions";
import { Paper } from "@material-ui/core";
import './AddVideo.css';

class AddVideo extends Component {
  initialState = {
    message: "Drag & drop URL here",
  };
  state = { ...this.initialState };

  onDragOver = (event) => {
    event.preventDefault();
  };

  onDragEnter = () => {
    this.setState({
      message: "Drop here!",
    });
  };

  onDragLeave = () => {
    this.setState(this.initialState);
  };

  onDrop = async (event) => {
    event.preventDefault();
    const url = event.dataTransfer.getData("text");

    if (validator.isURL(url) && url.match(/bbc\.co\.uk/)) {
      this.props.createVideo(url);

      this.setState({
        message: "Video(s) added.",
        bgcolor: "#2f28",
        border: "8px solid green",
      });
    } else {
      this.setState({ message: "URL not usuable", bgcolor: "#f228" });
    }

    setTimeout(() => {
      this.setState(this.initialState);
    }, 2000);
  };

  render() {
    return (
      <Paper
        className="dropzone"
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        {this.state.message}
      </Paper>
    );
  }
}

export default connect(null, { createVideo })(AddVideo);

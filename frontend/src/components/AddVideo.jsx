import React, { Component } from 'react';
import validator from 'validator';
import { connect } from 'react-redux';
import './AddVideo.css';
import { createVideo } from '../actions';

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

		const url = event.dataTransfer.getData('text');

		if (validator.isURL(url) && url.match(/bbc\.co\.uk/)) {
			this.props.createVideo(url);

			this.setState({ message: 'Video(s) added.', bgcolor: '#ccffcc' });
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

export default connect(
	null,
	{ createVideo }
)(AddVideo);

import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddVideo from './AddVideo';
import VideoList from './VideoList';
import Status from './Status';
import './App.css';
import { getStatus, getVideos } from '../actions';

class App extends Component {
	componentDidMount() {
		this.props.getStatus();
		this.props.getVideos();
	}

	render() {
		return (
			<div className="ui container vertically divided">
				<div className="row">
					<h1>BBC-Downloader</h1>
				</div>

				<div className="row">
					<h2>Service Status</h2>
					<Status />
				</div>

				<div className="row">
					<h2>Add new download</h2>
					<AddVideo callBack={this.reloadVideos} />
				</div>

				<div className="row">
					<h2>Download list</h2>
					<VideoList />
				</div>

				{/* <div className="row">
					<h2>Finished videos</h2>
					<VideoList videos={this.props.completed} />
				</div> */}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		videos: state.videos,
	};
};

export default connect(
	mapStateToProps,
	{ getStatus, getVideos }
)(App);

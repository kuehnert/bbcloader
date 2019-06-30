import React, { Component } from 'react';

import backend from './api/backend';
import AddVideo from './components/AddVideo';
import VideoList from './components/VideoList';
import './App.css';

class App extends Component {
	state = { videos: null, completed: [], status: { externalIP: null, isOnline: null, currentDownload: null } };

	reloadVideos = async () => {
		const status = await backend.get('/status');
		const resVideos = await backend.get('/videos');
		const resCompleted = await backend.get('/completed');
		this.setState({ videos: resVideos.data, completed: resCompleted.data, status: status.data });
	};

	componentDidMount = () => {
		this.reloadVideos();
	};

	render() {
		const { externalIP, isOnline, currentDownload } = this.state.status;

		if (!this.state.videos) {
			return <div>Waiting for server...</div>;
		}

		return (
			<div className="ui container vertically divided">
				<div className="row">
					<h1>BBC-Downloader</h1>
				</div>

				<div className="row">
					<h2>Service Status</h2>
					<div className="ui segment">
						<div className="ui three column very relaxed stackable grid">
							<div className="column">IP: {externalIP}</div>
							<div className="column">Online: {isOnline ? '✔' : '❌'}</div>
							<div className="column">
								Currently downloading: {currentDownload ? currentDownload.title : '– none –'}
							</div>
						</div>
					</div>
				</div>

				<div className="row">
					<h2>Add new download</h2>
					<AddVideo callBack={this.reloadVideos} />
				</div>

				<div className="row">
					<h2>Download list</h2>
					<VideoList videos={this.state.videos} />
				</div>

				<div className="row">
					<h2>Finished videos</h2>
					<VideoList videos={this.state.completed} />
				</div>
			</div>
		);
	}
}

export default App;

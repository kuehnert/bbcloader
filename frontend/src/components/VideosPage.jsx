import React from 'react';
import Status from './Status'
import AddVideo from './AddVideo'
import VideoList from './VideoList'

export default function VideosPage() {
	return (
		<div className="ui container vertically divided">
			<div className="row">
				<h1>BBC-Downloader</h1>
			</div>

			<div className="row">
				<h2>Service status</h2>
				<Status />
			</div>

			<div className="row">
				<h2>Add new download</h2>
				<AddVideo />
			</div>

			<div className="row">
				<h2>Download list</h2>
				<VideoList />
			</div>

		</div>
	);
}

/*
			<div className="row">
                <h2>Finished videos</h2>
                <VideoList videos={this.props.completed} />
            </div>
*/

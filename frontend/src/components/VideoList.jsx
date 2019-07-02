import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getVideos } from '../actions';
import Video from './Video';

class VideoList extends Component {
	componentDidMount() {
		this.props.getVideos();
	}

	render() {
		const { videos } = this.props;

		if (videos.length === 0) {
			return <div>Currently, there are no videos in the download queue.</div>;
		} else {
			const videoRows = videos.map(video => {
				return <Video video={video} key={video.id} />;
			});

			return (
				<div className="VideoList">
					<table className="ui striped table">
						<thead>
							<tr>
								<th>Programme</th>
								<th>Series</th>
								<th>Episode</th>
								<th>Title</th>
								<th>Tagged?</th>
								<th>Attempts</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>{videoRows}</tbody>
						<tfoot>
							<tr>
								<th colSpan={7}>
									<b>{videos.length}</b> Videos on download list
								</th>
							</tr>
						</tfoot>
					</table>
				</div>
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
)(VideoList);

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import history from '../history';
import './Video.css';
import { connect } from 'react-redux';
import { deleteVideo } from '../actions';

class Video extends Component {
	renderSeriesEpisode({ id, programme, series, episodeNumber, episodeTitle, url }) {
		if (programme && series >= 0) {
			return (
				<>
					<td>
						<a href={url} target="new" onClick={e => e.stopPropagation()}>
							{programme}
						</a>
					</td>
					<td className="right">{series}</td>
					<td className="right">{episodeNumber}</td>
					<td>{episodeTitle}</td>
				</>
			);
		} else if (programme) {
			return (
				<>
					<td colSpan={4}>
						<Link to={`/videos/edit/${id}`}>{programme}</Link>
					</td>
				</>
			);
		} else {
			return (
				<>
					<td colSpan={4}>
						<Link to={`/videos/edit/${id}`}>{url}</Link>
					</td>
				</>
			);
		}
	}

	render() {
		const { id, attempts, tagged } = this.props.video;
		return (
			<tr onClick={() => history.push(`/videos/edit/${id}`)}>
				{this.renderSeriesEpisode(this.props.video)}
				<td>{tagged ? '✔' : '❌'}</td>
				<td className="right">{attempts}</td>
				<td>
					<button className="ui button red" onClick={(event) => {
						event.stopPropagation()
						this.props.deleteVideo(id)
					}}>
						Delete
					</button>
				</td>
			</tr>
		);
	}
}

const mapDispatchToProps = {
	deleteVideo,
};

export default connect(
	null,
	mapDispatchToProps
)(Video);

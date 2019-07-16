import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import history from '../history';
import './Video.css';
import { connect } from 'react-redux';
import { deleteVideo } from '../actions';
import { TableRow, TableCell, Button } from '@material-ui/core';

class Video extends Component {
	renderSeriesEpisode({ id, programme, series, episodeNumber, episodeTitle, url }) {
		if (programme && series >= 0) {
			return (
				<>
					<TableCell>
						<a href={url} target="new" onClick={e => e.stopPropagation()}>
							{programme}
						</a>
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
		const { id, attempts, tagged } = this.props.video;
		return (
			<TableRow onClick={() => history.push(`/videos/edit/${id}`)}>
				{this.renderSeriesEpisode(this.props.video)}
				<TableCell>{tagged ? '✔' : '❌'}</TableCell>
				<TableCell className="right">{attempts}</TableCell>
				<TableCell>
					<Button variant="contained" color="secondary" size="small" onClick={(event) => {
						event.stopPropagation()
						this.props.deleteVideo(id)
					}}>
						Delete
					</Button>
				</TableCell>
			</TableRow>
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

import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getVideo, updateVideo } from '../actions';
import VideoForm from './VideoForm';

class EditVideo extends Component {
	componentDidMount() {
		const { id } = this.props.match.params;
		this.props.getVideo(id);
	}

	onSubmit = formValues => {
		const { id } = this.props.match.params;
		this.props.updateVideo(id, _.omit(formValues, 'id'));
	};

	render() {
		const { video } = this.props;

		if (!video) {
			return <div>Loading...</div>;
		}

		return (
			<div>
				<h2>Edit Video</h2>
				<VideoForm
					onSubmit={this.onSubmit}
					initialValues={_.pick(
						video,
						'id',
						'url',
						'programme',
						'series',
						'episodeNumber',
						'episodeTitle',
						'filename',
						'attempts',
						'tagged'
					)}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const { id } = ownProps.match.params;

	return {
		video: state.videos[id],
	};
};

export default connect(
	mapStateToProps,
	{ getVideo, updateVideo }
)(EditVideo);

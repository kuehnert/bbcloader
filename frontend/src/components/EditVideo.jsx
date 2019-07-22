import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getVideo, updateVideo } from '../actions';
import VideoForm from './VideoForm';
import history from '../history';

class EditVideo extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getVideo(id);
  }

  handleSubmit = formValues => {
    const { id } = this.props.match.params;
    this.props.updateVideo(id, _.omit(formValues, 'id'));
  };

  render() {
    if (this.props.errors.length > 0) {
      history.push('/');
    }

    const { video } = this.props;
    if (!video) {
      return <div>Loading...</div>;
    }

    return (
      <VideoForm
        onSubmit={this.handleSubmit}
        initialValues={{..._.pick(
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
        ), isFilm: video.series === -1}}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;

  return {
    errors: state.errors,
    video: state.videos[id],
  };
};

export default connect(
  mapStateToProps,
  { getVideo, updateVideo }
)(EditVideo);

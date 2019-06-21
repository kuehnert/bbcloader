import React, { Component } from 'react';
import backend from './api/backend';
import AddVideo from './components/AddVideo';
import VideoList from './components/VideoList';

class App extends Component {
  state = { videos: [] };

  componentDidMount = async () => {
    const res = await backend.get('/videos');
    console.log('videos: ', res.data);
    this.setState({ videos: res.data });
  }

  render() {
    return (
      <div className="ui container" style={{ marginTop: '20px' }}>
        <h1>BBC-Downloader</h1>

        <p>Status message here</p>

        <AddVideo />

        <VideoList videos={this.state.videos} />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import backend from './api/backend';
import AddVideo from './components/AddVideo';
import VideoList from './components/VideoList';
import './App.css';

class App extends Component {
  state = { videos: [], completed: [] };

  reloadVideos = async () => {
    const resVideos = await backend.get('/videos');
    const resCompleted = await backend.get('/completed');
    this.setState({ videos: resVideos.data, completed: resCompleted.data });
  };

  componentDidMount = () => {
    this.reloadVideos();
  };

  render() {
    return (
      <div className="ui container vertically divided">
        <div className="row">
          <h1>BBC-Downloader</h1>
        </div>

        <div className="row">
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

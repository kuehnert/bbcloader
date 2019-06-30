import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import './App.css';
import history from '../history';
import VideosPage from './VideosPage'
import EditVideo from './EditVideo'

class App extends Component {
	render() {
		return (
			<div className="ui container">
				<Router history={history}>
					<div>
						<Route path="/" exact component={VideosPage} />
						<Route path="/videos/:id/edit" componnet={EditVideo} />
						<Route path="/videos/:id/delete" componnet={null} />
					</div>
				</Router>
			</div>
		);
	}
}

export default App;

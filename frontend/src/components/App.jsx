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
						<Route path="/videos/edit/:id" component={EditVideo} />
						<Route path="/videos/delete/:id" component={null} />
					</div>
				</Router>
			</div>
		);
	}
}

export default App;

import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import history from '../history';

class VideoForm extends Component {
	renderError({ error, touched }) {
		if (touched && error) {
			return <div className="ui error message">{error}</div>;
		}
	}

	renderField = ({ input, label, name, meta, type = "text" }) => {
		const className = `field ${meta.touched && meta.error ? 'error' : ''}`;

		return (
			<div className={className}>
				<label htmlFor={name}>{label}</label>
				<input {...input} type={type} autoComplete="off" />
				<div>{this.renderError(meta)}</div>
			</div>
		);
	};

	onSubmit = formValues => {
		this.props.onSubmit(formValues);
	};

	render() {
		return (
			<form className="ui form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
				<Field name="id" component={this.renderField} label="ID" />
				<Field name="url" component={this.renderField} label="URL" />
				<Field name="programme" component={this.renderField} label="Programme" />
				<Field name="series" component={this.renderField} label="Series" />
				<Field name="episodeNumber" component={this.renderField} label="Episode Number" />
				<Field name="episodeTitle" component={this.renderField} label="Episode Title" />
				<Field name="filename" component={this.renderField} label="Filename" />
				<Field name="attempts" component={this.renderField} label="Attempts" />
				<Field name="tagged" component={this.renderField} label="Tagged" type="checkbox" />

				<button className="ui button" onClick={() => history.push('/')}>Cancel</button>
				<button className="ui button primary">Submit</button>
			</form>
		);
	}
}

const validate = formValues => {
	const errors = {};

	if (!formValues.url) {
		errors.url = 'You must enter a URL';
	}

	return errors;
};

export default reduxForm({ form: 'videoForm', validate })(VideoForm);

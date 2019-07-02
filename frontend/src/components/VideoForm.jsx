import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import history from '../history';

// const filenameFields = ["programme", "series", "episodeNumber", "episodeTitle"];

function autoFilename({ programme, series, episodeNumber, episodeTitle }) {
  return `${programme.trim()} S${series.toString().padStart(2, '0')}E${episodeNumber.toString().padStart(2, '0')} ${episodeTitle.trim()}`;
}

class VideoForm extends Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="ui error message">{error}</div>;
    }
  }

  renderField = ({ input, label, name, meta, type = 'text' }) => {
    const className = `field ${meta.touched && meta.error ? 'error' : ''}`;

    return (
      <div className={className}>
        <label htmlFor={name}>{label}</label>
        <input {...input} type={type} autoComplete="off" />
        <div>{this.renderError(meta)}</div>
      </div>
    );
  };

  onChange = event => {
    this.props.change('filename', autoFilename({ ...this.props, [event.target.name]: event.target.value }));
  };

	onSubmit = formValues => {
		Object.keys(formValues).map(k => formValues[k] = formValues[k].toString().trim());
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <form className="ui form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field name="id" component={this.renderField} label="ID" />
        <Field name="url" component={this.renderField} label="URL" />
        <Field name="programme" onChange={this.onChange} component={this.renderField} label="Programme" />
        <Field name="series" onChange={this.onChange} component={this.renderField} label="Series" />
        <Field name="episodeNumber" onChange={this.onChange} component={this.renderField} label="Episode Number" />
        <Field name="episodeTitle" onChange={this.onChange} component={this.renderField} label="Episode Title" />
        <Field name="filename" component={this.renderField} label="Filename" />
        <Field name="attempts" component={this.renderField} label="Attempts" />
        <Field name="tagged" component={this.renderField} label="Tagged" type="checkbox" />

        <button className="ui button" onClick={() => history.push('/')}>
          Cancel
        </button>
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

VideoForm = reduxForm({ form: 'videoForm', validate })(VideoForm);

const selector = formValueSelector('videoForm');

export default connect(state => selector(state, 'programme', 'series', 'episodeNumber', 'episodeTitle'))(VideoForm);

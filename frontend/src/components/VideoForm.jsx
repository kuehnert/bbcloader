import {
  Radio,
  RadioGroup,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import history from '../history';

class VideoForm extends Component {
  autoFilename({ programme, series, episodeNumber, episodeTitle, isFilmValue }) {
    if (isFilmValue) {
      return programme.trim();
    } else {
      return `${programme.trim()} S${series.toString().padStart(2, '0')}E${episodeNumber
        .toString()
        .padStart(2, '0')} ${episodeTitle.trim()}`;
    }
  }

  onChange = event => {
    this.props.change('filename', this.autoFilename({ ...this.props, [event.target.name]: event.target.value }));
  };

  onIsFilmChange = newValueStr => {
    const isFilmValue = newValueStr === 'true';
    let series = -1;
    let episodeNumber = -1;
    let episodeTitle = '';

    if (isFilmValue) {
      this.props.change('series', series);
      this.props.change('episodeNumber', episodeNumber);
      this.props.change('episodeTitle', episodeTitle);
    } else {
      series = 0;
      episodeNumber = 0;
      this.props.change('series', series);
      this.props.change('episodeNumber', episodeNumber);
    }

    this.props.change("isFilm", newValueStr);
    this.props.change("isFilmValue", isFilmValue);
    this.props.change(
      'filename',
      this.autoFilename({ ...this.props, series, episodeNumber, episodeTitle, isFilmValue })
    );
  };

  onSubmit = formValues => {
    Object.keys(formValues).map(k => (formValues[k] = formValues[k].toString().trim()));
    this.props.onSubmit(formValues);
  };

  renderCheckbox({ input, label }) {
    return (
      <div>
        <FormControlLabel
          control={<Checkbox checked={input.value ? true : false} onChange={input.onChange} />}
          label={label}
        />
      </div>
    );
  }

  renderField = ({ input, label, type, meta: { touched, invalid, error } }) => {
    const { classes } = this.props;

    return (
      <div>
        <TextField className={classes.textField} label={label} fullWidth margin="normal" type={type} {...input} />
      </div>
    );
  };

  renderRadioGroup = ({ input, ...rest }) => (
    <FormControl>
      <RadioGroup {...input} {...rest} onChange={(event, newValue) => this.onIsFilmChange(newValue)}>
        <FormControlLabel value="true" control={<Radio />} label="Film" />
        <FormControlLabel value="false" control={<Radio />} label="TV Episode" />
      </RadioGroup>
    </FormControl>
  );

  render() {
    const { classes, isFilmValue } = this.props;

    return (
      <div className={classes.root}>
        <form onSubmit={this.props.handleSubmit}>
          <Card className={classes.card}>
            <CardHeader title="Edit Video" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field name="id" component={this.renderField} label="ID" />
                </Grid>
                <Grid item xs={12}>
                  <Field name="url" component={this.renderField} label="URL" />
                </Grid>

                <Grid item xs={12}>
                  <Field name="programme" component={this.renderField} label="Programme" onChange={this.onChange} />
                </Grid>

                <Grid item xs={12}>
                  <Field name="isFilm" component={this.renderRadioGroup} label="Kind" />
                </Grid>

                {!isFilmValue && (
                  <>
                    <Grid item xs={2}>
                      <Field
                        name="series"
                        component={this.renderField}
                        label="Series"
                        type="number"
                        onChange={this.onChange}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Field
                        name="episodeNumber"
                        component={this.renderField}
                        label="Episode"
                        type="number"
                        onChange={this.onChange}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Field
                        name="episodeTitle"
                        component={this.renderField}
                        label="Episode Title"
                        onChange={this.onChange}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Field name="filename" component={this.renderField} label="Filename" />
                </Grid>
                <Grid item xs={6}>
                  <Field name="attempts" component={this.renderField} label="Attempts" type="number" />
                </Grid>
                <Grid item xs={6}>
                  <Field name="tagged" component={this.renderCheckbox} label="Tagged" type="checkbox" />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button color="secondary" onClick={() => history.push('/')}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>
    );
  }
}

const styles = {
  root: { padding: '10vh' },
  card: { margin: 'auto', backgroundColor: '#4448', maxWidth: 640 },
};

const validate = formValues => {
  const errors = {};

  if (!formValues.url) {
    errors.url = 'You must enter a URL';
  }

  return errors;
};

const selector = formValueSelector('videoForm');

export default connect(state => {
  let { series, programme, episodeNumber, episodeTitle } = selector(
    state,
    'series',
    'programme',
    'episodeNumber',
    'episodeTitle'
  );
  const isFilmValue = selector(state, 'isFilmValue');

  return { programme, series, episodeNumber, episodeTitle, isFilmValue };
})(reduxForm({ form: 'videoForm', validate })(withStyles(styles)(VideoForm)));

import MyInput from 'components/MyInput';
import { Field, Form, Formik, useFormikContext } from 'formik';
import myhistory from 'myhistory';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import React, { useEffect } from 'react';
import { formatEpisodeNumber } from 'utils/helpers';
import * as Yup from 'yup';
import { Download } from './downloadSlice';

interface Props {
  download: Download;
  handleSubmit: (download: Download) => void;
}

const MakeFilename = () => {
  const { values, setFieldValue } = useFormikContext();
  const { isFilm, programme, series, episodeNumber, episodeTitle } =
    values as Download;

  useEffect(() => {
    if (isFilm) {
      setFieldValue('filename', `${programme.trim()}`);
    } else {
      if (series < 0 || episodeNumber < 0) {
        setFieldValue('series', 1);
        setFieldValue('episodeNumber', 1);
      }

      setFieldValue(
        'filename',
        `${programme} ${formatEpisodeNumber({ series, episodeNumber })} ${
          episodeTitle ? episodeTitle.trim() : ''
        }`.trim()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilm, programme, series, episodeNumber, episodeTitle]);

  return null;
};

const DownloadSchema = Yup.object().shape({
  bbcID: Yup.string().required('notwendig'),
  url: Yup.string().url().required('notwendig'),
  programme: Yup.string().required('notwendig'),
  isFilm: Yup.boolean(),
  series: Yup.number().when('isFilm', {
    is: false,
    then: Yup.number().required().min(0),
  }),
  episodeNumber: Yup.number().when('isFilm', {
    is: false,
    then: Yup.number().required(),
  }),
  attempts: Yup.number().min(0),
});

const DownloadForm: React.FC<Props> = ({ download, handleSubmit }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={download}
      onSubmit={handleSubmit}
      validationSchema={DownloadSchema}>
      {({ values, setFieldValue }) => (
        <Form className='p-grid p-fluid p-justify-end'>
          <MyInput id='bbcID' name='bbcID' label='BBC-ID' as={InputText} />
          <MyInput id='url' name='url' label='URL' as={InputText} />
          <MyInput
            id='programme'
            name='programme'
            label='Programme'
            as={InputText}
          />

          <label htmlFor='isFilm' className='p-col-2'>
            Film/TV?
          </label>
          <div className='p-col-10'>
            <div className='p-col-12'>
              <RadioButton
                value={values.isFilm}
                name='isFilm'
                onChange={() => setFieldValue('isFilm', true)}
                checked={values.isFilm}
              />
              <label> Film</label>
            </div>
            <div className='p-col-12'>
              <RadioButton
                value={values.isFilm}
                name='isFilmValue'
                onChange={() => setFieldValue('isFilm', false)}
                checked={!values.isFilm}
              />
              <label> TV Episode</label>
            </div>
          </div>

          {!values.isFilm && (
            <>
              <MyInput
                id='series'
                name='series'
                label='Series'
                as={InputNumber}
              />
              <MyInput
                id='episodeNumber'
                name='episodeNumber'
                label='Episode'
                as={InputNumber}
              />
              <MyInput
                id='episodeTitle'
                name='episodeTitle'
                label='Episode Title'
                as={InputText}
              />
            </>
          )}

          <MakeFilename />

          <MyInput
            id='filename'
            name='filename'
            label='Filename'
            as={InputText}
          />

          {/* <MyInput
            id='attempts'
            name='attempts'
            label='Attempts'
            component={InputNumber}
          /> */}

          <label htmlFor='attempts' className='p-col-2'>
            Attempts
          </label>
          <div className='p-col-10'>
            <Field
              id='attempts'
              name='attempts'
              label='Attempts'
              type="number"
              as={InputText}
            />
          </div>

          <label htmlFor='isFilm' className='p-col-2'>
            Ready?
          </label>
          <div className='p-col-10'>
            <Checkbox
              id='tagged'
              name='tagged'
              checked={values.tagged}
              onChange={() => setFieldValue('tagged', !values.tagged)}
            />
          </div>

          <div className='p-col-3'>
            <Button
              type='button'
              label='Abbrechen'
              onClick={() => myhistory.goBack()}
              className='p-button-secondary'
            />
          </div>

          <div className='p-col-3'>
            <Button type='submit' label='Speichern' />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DownloadForm;

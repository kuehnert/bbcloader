import MyInput from 'components/MyInput';
import { Form, Formik, useFormikContext } from 'formik';
import myhistory from 'myhistory';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import React, { useEffect } from 'react';
import { formatEpisodeNumber } from 'utils/helpers';
import * as Yup from 'yup';
import { Video } from './videoSlice';

interface Props {
  video: Video;
  handleSubmit: (video: Video) => void;
}

const MakeFilename = () => {
  const { values, setFieldValue } = useFormikContext();
  const { isFilm, programme, series, episodeNumber, episodeTitle } = values as Video;

  useEffect(() => {
    if (isFilm) {
      setFieldValue('filename', `${programme}`);
    } else {
      if (series < 0 || episodeNumber < 0) {
        setFieldValue('series', 1);
        setFieldValue('episodeNumber', 1);
      }

      setFieldValue(
        'filename',
        `${programme.trim()} ${formatEpisodeNumber({ series, episodeNumber })} ${episodeTitle.trim()}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilm, programme, series, episodeNumber, episodeTitle]);

  return null;
};

const VideoSchema = Yup.object().shape({
  id: Yup.string().required('notwendig'),
  url: Yup.string().url().required('notwendig'),
  programme: Yup.string().required('notwendig'),
  series: Yup.number().min(0),
  episodeNumber: Yup.number().min(0),
  attempts: Yup.number().min(0),
});

const VideoForm: React.FC<Props> = ({ video, handleSubmit }) => {
  return (
    <Formik enableReinitialize initialValues={video} onSubmit={handleSubmit} validationSchema={VideoSchema}>
      {({ values, setFieldValue }) => (
        <Form className="p-grid p-fluid p-justify-end">
          <MyInput id="id" name="id" label="ID" as={InputText} />
          <MyInput id="url" name="url" label="URL" as={InputText} />
          <MyInput id="programme" name="programme" label="Programme" as={InputText} />

          <label htmlFor="isFilm" className="p-col-2">
            Film/TV?
          </label>
          <div className="p-col-10">
            <div className="p-col-12">
              <RadioButton
                value={values.isFilm}
                name="isFilm"
                onChange={() => setFieldValue('isFilm', true)}
                checked={values.isFilm}
              />
              <label> Film</label>
            </div>
            <div className="p-col-12">
              <RadioButton
                value={values.isFilm}
                name="isFilmValue"
                onChange={() => setFieldValue('isFilm', false)}
                checked={!values.isFilm}
              />
              <label> TV Episode</label>
            </div>
          </div>

          {!values.isFilm && (
            <>
              <MyInput id="series" name="series" label="Series" as={InputNumber} />
              <MyInput id="episodeNumber" name="episodeNumber" label="Episode" as={InputNumber} />
              <MyInput id="episodeTitle" name="episodeTitle" label="Episode Title" as={InputText} />
            </>
          )}

          <MyInput id="filename" name="filename" label="Filename" as={InputText} />
          <MyInput id="attempts" name="attempts" label="Attempts" as={InputNumber} />
          <MakeFilename />

          <div className="p-col-3">
            <Button type="button" label="Abbrechen" onClick={() => myhistory.goBack()} className="p-button-secondary" />
          </div>

          <div className="p-col-3">
            <Button type="submit" label="Speichern" />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VideoForm;

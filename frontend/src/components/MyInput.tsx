import { ErrorMessage, Field } from 'formik';
import React from 'react';
import styles from './MyInput.module.scss';
import classnames from 'classnames'

interface Props {
  name: string;
  label: string;
  as: any;
  hint?: string;
  [key: string]: any;
}

const MyInput: React.FC<Props> = (props) => {
  const { label, name, hint } = props;

  return (
    <>
      <label htmlFor={name} className={classnames("p-col-2", styles.label)}>
        {label}
      </label>

      <div className="p-col-10">
        <Field {...props} />
        {hint && <div dangerouslySetInnerHTML={{ __html: hint }} />}
        <ErrorMessage name={name} component="div" className="fieldErrorMessage" />
      </div>
    </>
  );
};

export default MyInput;

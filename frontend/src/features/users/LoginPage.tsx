import MyInput from 'components/MyInput';
import { Form, Formik } from 'formik';
import history from 'myhistory';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { login, LoginValues } from './userSlice';

const LoginPage: React.FC = () => {
  const { error } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  const handleSubmit = async (values: LoginValues) => {
    console.log(JSON.stringify(values, null, 4));

    dispatch(login(values));
    history.push('/');
  };

  return (
    <div className='p-grid'>
      <div className='p-col'></div>
      <div className='p-col'>
        <Card title='Login'>
          {error && <p>{error}</p>}
          <Formik
            onSubmit={handleSubmit}
            initialValues={{ email: '', password: '' }}>
            {({ touched }) => (
              <Form>
                <MyInput name="email" label="E-Mail" as={InputText} />
                <MyInput name="password" label="Password" type="password" as={InputText} />

                <div className=''>
                  <Button
                    type='submit'
                    className='classes.submit'
                    disabled={!touched}>
                    Signin
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
      <div className='p-col'></div>
    </div>
  );
};

export default LoginPage;

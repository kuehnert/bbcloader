import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decode } from 'jsonwebtoken';
import { AppThunk } from '../../store';
import authHeader from '../../utils/authHeader';
import bbcApi from '../../api/bbcApi'
// import { setAlert } from '../globals/globalSlice';

export interface User {
  id: string;
  name: string;
  email: string;
};

export interface LoginValues {
  email: string;
  password: string;
}

export interface UserState {
  isLoggedIn: boolean;
  isRequesting: boolean;
  user: User | null;
  error: string | null;
}

export interface UnauthorizedPayload {
  resourceType: string;
  resources: string[];
  status: number;
  message: string;
}

// TODO: check token
let user;
console.log('userSlice: loading user from storage...');
try {
  const storeduser = localStorage.getItem('user');
  user = storeduser != null ? JSON.parse(storeduser) : null;
  const token = localStorage.getItem('token');

  if (token) {
    let decoded: any = decode(token);

    if (Date.now() >= decoded.exp * 1000) {
      console.log('token expired');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      user = null;
    }
  }
} catch (error) {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  user = null;
}

const initialState: UserState = {
  isLoggedIn: user == null ? false : true,
  isRequesting: false,
  user,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoggedIn = action.payload != null;
      state.error = null;
      state.isRequesting = false;
    },
    logoutFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.user = null;
      state.isLoggedIn = false;
      state.isRequesting = false;
    },
    logoutSuccess(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.isRequesting = false;
    },
    submitting(state) {
      state.isRequesting = true;
    },
    requestFailed(state, action: PayloadAction<UnauthorizedPayload>) {
      // console.log('state:', state);
      // console.log('action:', action);
      const code = action.payload.status;

      if (code === 401 || code === 403) {
        // Unauthorized
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.isRequesting = false;
      }
    },
  },
});

export const {
  loginSuccess,
  logoutFailed,
  logoutSuccess,
  requestFailed,
  submitting,
} = userSlice.actions;

export default userSlice.reducer;

export const login = (values: LoginValues): AppThunk => async dispatch => {
  dispatch(submitting());
  let user, token;
  try {
    const response = await bbcApi.post('/users/login', values);
    user = response.data.user;
    token = response.data.token;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  } catch ({ response }) {
    dispatch(requestFailed({ resourceType: 'users', resources: [], ...response }));
    // dispatch(
    //   setAlert({
    //     type: 'error',
    //     message: 'Beim Anmelden gab es einen Fehler. Bitte probieren Sie es später noch einmal.',
    //   }),
    // );
    return;
  }

  dispatch(loginSuccess(user));
  // dispatch(setAlert({ type: 'success', message: 'Sie haben sich erfolgreich angemeldet.' }));
};

export const logout = (): AppThunk => async dispatch => {
  try {
    await bbcApi.post('/users/logout', null, { headers: authHeader() });
  } catch ({ response }) {
    dispatch(logoutFailed(response));
    return;
  } finally {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  dispatch(logoutSuccess());
  // dispatch(setAlert({ type: 'success', message: 'Sie haben sich erfolgreich abgemeldet.' }));
};

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { authSuccess, authFail } from '../actions/auth-actions';

import FrontScreen from "../containers/login/FrontScreen";

export const Login = connect(null, dispatch => ({
  login: () => {
    dispatch(authSuccess());
    dispatch(push('/'));
  }
}))(FrontScreen);

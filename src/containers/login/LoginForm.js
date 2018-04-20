import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import PropTypes from "prop-types";
import submit from "../../auth/submit";
import LoaderHorizontal from "../../components/common/LoaderHorizontal";
import "../../scss/LoginForm.scss";
import { push } from "react-router-redux";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.isAuthenticated){
      if(new Date(this.props.tokenExpirationDate) > new Date()){
        this.props.dispatch(push("/main"));
      }
    }
  }

  render() {
    const { handleSubmit, error } = this.props;

    return (
      <div className="login-wrapper">
        <div className="container login-form">
          <form onSubmit={handleSubmit}>
            <div className="container login-details">
              <div className="user-container">
                <Field
                  component="input"
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  required
                />
              </div>

              <div className="password-container">
                <Field
                  type="password"
                  component="input"
                  placeholder="Enter Password"
                  name="password"
                  required
                />
              </div>

              <div className="context-container">
                {error && <strong>{error}</strong>}
                {this.props.loading === true && <LoaderHorizontal />}
              </div>

              <div className="centric-container">
                <button className="submitter dcmt-button" type="submit">
                  Login
                </button>
              </div>
            </div>

            <div className="container">
              <span className="psw">
                Forgot <a href="#">password?</a>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.authReducer.loading,
    isAuthenticated: state.authReducer.isAuthenticated,
    tokenExpirationDate: state.authReducer.tokens.tokenExpirationDate
  };
};

const Form = reduxForm({
  form: "login",
  onSubmit: submit
})(LoginForm);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  tokenExpirationDate: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Form);

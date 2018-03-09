import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as usersActions from "../../../../actions/usersActions";
import Users from "../views/Users";

import "../../../../scss/containers/UsersContainer.scss";

class UsersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 3
    };
  }

  componentDidMount() {
    this.props.userActions.loadUsers(this.state.page);
  }

  render() {
    return (
      <div>
        <Users users={this.props.users} />
      </div>
    );
  }
}

UsersContainer.propTypes = {
  // dispatch: PropTypes.function,
  users: PropTypes.array
};

function mapStateToProps(state) {
  return {
    users: state.usersReducer.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(usersActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);

import React, { Component } from "react";
import Icon from "../common/Icon";
import SmoothTable from "../common/SmoothTable";
import { connect } from "react-redux";
import Confirmation from "../common/modals/Confirmation";
import { setActionConfirmation } from "../../actions/asyncActions";
import Modal from "react-responsive-modal";
import EditUserDetails from "../users/modals/EditUserDetails";
import WebApi from "../../api";
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import IntermediateBlock from './../common/IntermediateBlock';
import binaryPermissioner from './../../api/binaryPermissioner';

class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      user: {},
      responseBlock: {},
      loading: false
    };
  }

  handleGetUser = object => {
    this.setState({
      user: object
    });

    this.handleOpenModal();
  };

  handleRoleChange = roles => {
    let _user = this.state.user;
    _user.roles = roles;

    this.setState({
      user: _user
    });
  };

  changeUserRoles = () => {
    const { id, roles } = this.state.user;
    this.setState(
      {
        loading: true
      },
      () => {
        WebApi.users.patch.roles(id, roles)
          .then(response => {
            this.setState({
              responseBlock: response,
              loading: false
            });
            setTimeout(() => {
              this.handleCloseModal();
            }, 500);
          })
          .catch(error => {
            this.setState({
              responseBlock: error,
              loading: false
            });
          });
      }
    );
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  rolesArrayToSignificantSymbol(rolesArray) {
    const symbol = [
      'D', 'S', 'H', 'T', 'A', 'M'
    ];
    const roles = [
      'Developer', 'Tradesman', 'Human Resources', 'Team Leader', 'Administrator', 'Manager'
    ];
    let symbols = [];

    for(let i = 0; i < symbol.length; i++){
      if(rolesArray.indexOf(roles[i]) >= 0) symbols.push(
        <span className={'user-role-symbol ' + roles[i]} key={i} title={roles[i]}>{symbol[i]}</span>
      );
      else {
        symbols.push(
          <span className={'user-role-symbol'} key={i}/>
        );
      }
    }

    return symbols;
  }

  render() {
    const { t } = this.props;
    const construct = {
      rowClass: "user-block",
      tableClass: "users-list-container",
      keyField: "id",
      pageChange: this.props.pageChange,
      defaultSortField: "lastName",
      defaultSortAscending: true,
      filtering: true,
      filterClass: "UserFilter",
      showDeletedCheckbox: true,
      disabledRowComparator: (object) => {
        return object.isDeleted;
      },
      operators: [
        {
          pretty: t("Add"),
          click: () => {
            this.props.openAddUserModal();
          },
          comparator: () => binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(this.props.binPem)
        }
      ],
      columns: [
        { width: 1, pretty: "Role", manualResolver: (user, column) => {
           return this.rolesArrayToSignificantSymbol(user.roles);
        }},
        { width: 20, field: "firstName", pretty: t("Name"), type: "text", filter: true },
        { width: 30, field: "lastName", pretty: t("Surname"), type: "text", filter: true },
        { width: 30, field: "email", pretty: t("Email"), type: "text", filter: true },
        { width: 19, field: "phoneNumber", pretty: t("Phone"), type: "text", filter: true },
        {
          width: 1,
          comparator: object => binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(this.props.binPem),
          toolBox: [
            {
              icon: { icon: "sync-alt" },
              title: t("ReactivateUserImperativus"),
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "reactivateUser",
                    string: `${t("ReactivateUserInfinitive")} ${object.firstName} ${
                      object.lastName
                    }`,
                    id: object.id,
                    successMessage: t("UserReactivated")
                  })
                );
              },
              comparator: object => object.isDeleted && binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(this.props.binPem)
            },
            {
              icon: { icon: "times" },
              title: t("DeleteUserImperativus"),
              click: object => {
                this.props.dispatch(
                  setActionConfirmation(true, {
                    key: "deleteUser",
                    string: `${t("DeleteUserInfinitive")} ${object.firstName} ${
                      object.lastName
                    }`,
                    id: object.id,
                    successMessage: t("UserDeleted")
                  })
                );
              },
              comparator: object => !object.isDeleted && binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(this.props.binPem)
            },
            {
              icon: { icon: "edit", iconType: "far" },
              title: t("EditUserImperativus"),
              click: object => {
                this.handleGetUser(object);
              },
              comparator: object => binaryPermissioner(false)(0)(0)(0)(0)(0)(1)(this.props.binPem)
            }
          ],
          pretty: t("DeleteEdit")
        }
      ]
    };

    let render = () => <div>
      <SmoothTable
        currentPage={this.props.currentPage}
        totalPageCount={this.props.totalPageCount}
        loading={this.props.loading}
        data={this.props.users}
        construct={construct}
      />
      <Modal
        open={this.state.showModal}
        classNames={{ modal: "Modal Modal-users" }}
        contentLabel="Edit users details"
        onClose={this.handleCloseModal}
      >
        <EditUserDetails
          closeModal={this.handleCloseModal}
          user={this.state.user}
          handleRoleChange={this.handleRoleChange}
          responseBlock={this.state.responseBlock}
          loading={this.state.loading}
          changeUserRoles={this.changeUserRoles}
        />
      </Modal>
    </div>;

    return <IntermediateBlock
      loaded={!this.state.loading}
      render={render}
      resultBlock={this.props.resultBlock}
      _className={'content-container'}
    />;
  }
}

function mapStateToProps(state) {
  return {
    binPem: state.authReducer.binPem
  };
}

UsersList.propTypes = {
  pageChange: PropTypes.func.isRequired,
  openAddUserModal: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPageCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  binPem: PropTypes.number,
  t: PropTypes.func,
  resultBlock: PropTypes.object
};

export default connect(mapStateToProps)(translate("UsersList")(UsersList));

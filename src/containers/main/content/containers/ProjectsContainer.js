import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as projectsActions from "../../../../actions/projectsActions";
import Modal from "react-responsive-modal";
import AddProjectScreen from "../../../../components/projectsModals/AddProjectScreen";
import ProjectsList from "../../../../components/projects/ProjectsList";

import "../../../../scss/containers/ProjectsContainer.scss";
import { ACTION_CONFIRMED } from "./../../../../constants";

class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      currentPage: 1,
      limit: 15
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.pageChange = this.pageChange.bind(this);
  }

  componentDidMount() {
    this.pageChange(this.state.currentPage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.validatePropsForProjectDeletion(nextProps)) {
      this.props.async.setActionConfirmationProgress(true);
      setTimeout(() => {
        this.props.async.setActionConfirmationResult({
          response: {
            status: 401
          }
        });
      }, 2000);
    }
  }

  validatePropsForProjectDeletion(nextProps) {
    return (
      nextProps.confirmed &&
      !nextProps.isWorking &&
      nextProps.type === ACTION_CONFIRMED &&
      nextProps.toConfirm.key === "deleteProject"
    );
  }

  pageChange(page) {
    this.setState(
      {
        currentPage: page
      },
      () =>
        this.props.projectActions.loadProjects(
          this.state.currentPage,
          this.state.limit
        )
    );
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <ProjectsList
          openAddProjectModal={this.handleOpenModal}
          projects={this.props.projects}
          currentPage={this.state.currentPage}
          totalPageCount={this.props.totalPageCount}
          pageChange={this.pageChange}
          loading={this.props.loading}
        />
        <Modal
          open={this.state.showModal}
          classNames={{ modal: "Modal" }}
          contentLabel="Projects test modal"
          onClose={this.handleCloseModal}
        >
          <AddProjectScreen
            projectActions={this.props.projectActions}
            limit={this.state.limit}
            currentPage={this.state.currentPage}
          />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projectsReducer.projects,
    totalPageCount: state.projectsReducer.totalPageCount,
    loading: state.asyncReducer.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsContainer);

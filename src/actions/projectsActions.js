import { LOAD_PROJECTS_SUCCESS } from "../constants";
import axios from "axios";
import DCMTWebApi from "../api";
import { asyncStarted, asyncEnded } from "./asyncActions";

export const loadProjectsSuccess = projects => {
  return {
    type: "LOAD_PROJECTS_SUCCESS",
    projects
  };
};

export const loadProjects = (page = 1, limit = 25, ascending = true, isDeleted = false) => {
  const settings = {
    Limit: limit,
    PageNumber: page,
    Ascending: ascending,
    IsDeleted: isDeleted
  };
  return dispatch => {
    dispatch(asyncStarted());
    DCMTWebApi.getProjects(settings)
      .then(response => {
        dispatch(loadProjectsSuccess(response.data.dtoObject));
        dispatch(asyncEnded());
      })
      .catch(error => {
        dispatch(asyncEnded());
      });
  };
};

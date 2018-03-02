import React, { Component } from "react";
import "../../scss/components/users/FoundUsersTable.scss";
import uuid from "uuid";

const FoundUsersTable = props => {
  const createList = property =>
    props.foundUsers.map((item, index) => (
      <li key={index}>{item[property]}</li>
    ));

  const firstNames = createList("firstName");
  const lastNames = createList("lastName");
  const emails = createList("email");

  const styles = {
    display: "inline-block",
    padding: "0 20px 0 0"
  };

  const tableData = props.foundUsers.map((item, index) => (
    <tr
      key={uuid.v4()}
      onClick={() => {
        console.log("Clicked!");
      }}
    >
      <td key={uuid.v4()}>{item.firstName}</td>
      <td key={uuid.v4()}>{item.lastName}</td>
    </tr>
  ));

  return (
    <div className="users-list-container">
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Last name</th>
          </tr>
          {tableData}
        </tbody>
      </table>
    </div>
  );
};

export default FoundUsersTable;

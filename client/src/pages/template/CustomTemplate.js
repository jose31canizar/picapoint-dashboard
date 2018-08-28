import React, { Component } from "react";
import withAuthorization from "../../components/withAuthorization";
import Footer from "../../layout/Footer";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CustomTemplate.styl";
class CustomPage extends Component {
  state = {
    users: null
  };
  componentDidMount() {
    db.onceGetUsers().then(snapshot =>
      this.setState({
        users: snapshot.val()
      })
    );
  }
  render() {
    const { className } = this.props;
    const { users } = this.state;
    return (
      <div class="custom-page">
        <section className={className}>
          {!!users ? (
            <UserList users={users} />
          ) : (
            <div>
              <FontAwesomeIcon icon="fa-spinner" />
              <p>loading users...</p>
            </div>
          )}
          <Footer />
        </section>
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <div class="user-list">
    <h3>List of Users</h3>
    {Object.keys(users).map(key => (
      <div class="user" key={"user-" + key}>
        <div class="profile-picture">
          <img src={users[key].profile_picture} />
        </div>
        <div class="user-info">
          <p class="name" key={key}>
            {users[key].name}
          </p>
          <p class="email" key={key}>
            {users[key].email}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(CustomPage);

import React, { Component } from "react";
import withAuthorization from "../../components/withAuthorization";
import Footer from "../../layout/Footer";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/fontawesome-free-solid";
import "./CustomTemplate.styl";
library.add(faSpinner);
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
              <FontAwesomeIcon icon={faSpinner} />
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
  <div>
    <h3>List of Users</h3>
    {Object.keys(users).map(key => (
      <p key={key}>{users[key].username}</p>
    ))}
  </div>
);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(CustomPage);

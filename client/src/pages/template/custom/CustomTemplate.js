import React, { Component } from "react";
import withAuthorization from "../../../components/withAuthorization";
import Footer from "../../../layout/Footer";
import { db } from "../../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CustomTemplate.styl";
class CustomPage extends Component {
  state = {
    users: null
  };
  componentDidMount() {
    db.onceGetUsers().then(snapshot => {
      let data = snapshot.val();
      console.log(Object.keys(data).map((key, i) => ({ ...data[key], id: i })));

      this.setState({
        users: Object.keys(data).map((key, i) => ({
          ...data[key],
          id: i
        }))
      });
    });
  }
  handleReorder = () => {};
  reorder = event => {
    const { users } = this.state;
    const movedItem = users.find((item, index) => index === event.oldIndex);
    const remainingItems = users.filter(
      (item, index) => index !== event.oldIndex
    );

    const reorderedItems = [
      ...remainingItems.slice(0, event.newIndex),
      movedItem,
      ...remainingItems.slice(event.newIndex)
    ];

    console.log(event, reorderedItems);

    this.setState({ users: reorderedItems });
  };
  render() {
    const { className } = this.props;
    const { users } = this.state;
    const { reorder } = this;
    return (
      <div class="custom-page">
        <section className={className}>
          {!!users ? (
            <UserList users={users} reorder={reorder} />
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

class UserList extends Component {
  state = {
    oldIndex: -1,
    newIndex: -1
  };
  render() {
    const { users, reorder } = this.props;
    const { oldIndex, newIndex } = this.state;
    return (
      <div class="user-list">
        <h3>List of Users</h3>
        {users.map(({ profile, name, email, id }, i) => (
          <div
            class="user"
            key={"user-" + id}
            draggable
            onDragStart={() => this.setState({ oldIndex: i })}
            onDragOver={e => {
              e.preventDefault();
              this.setState({ newIndex: i });
            }}
            onDrop={() => reorder({ oldIndex, newIndex })}
          >
            <div class="user-info">
              <div class="profile-picture">
                <img src={profile.profile_picture} />
              </div>
              <div class="user-caption">
                <p class="name">{name}</p>
                <p class="email">{email}</p>
              </div>
            </div>
            <div class="user-actions">
              <FontAwesomeIcon icon="angle-up" />
              <FontAwesomeIcon icon="angle-down" />
              <FontAwesomeIcon icon="lock" />
              <FontAwesomeIcon icon="trash" />
              <FontAwesomeIcon icon="times" />
              <FontAwesomeIcon icon="bars" />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(CustomPage);

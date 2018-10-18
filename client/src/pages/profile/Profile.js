import React, { Component } from "react";
import "./Profile.styl";

const ProfileHeader = props => (
  <div class="profile-header">
    <svg viewBox="0 -12 30 70" width="100" height="100">
      <path stroke="grey" strokeWidth="1" fill="none" d="M14.4 5.8c3.5 0 6.3 2.8 6.3 6.3s-2.8 6.3-6.3 6.3-6.3-2.8-6.3-6.3c.1-3.5 2.9-6.3 6.3-6.3zm10.9 29.1c1.2 0 2.1-1 2.1-2.2 0-.1 0-.3-.1-.4-1.2-5.4-6.1-7.9-11.9-7.9h-2c-5.8 0-10.7 2.5-11.9 7.9-.3 1.1.5 2.3 1.6 2.5.1 0 .3 0 .4.1h21.8z" />
    </svg>
  </div>
);

const ProfileInfo = props => (
  <div class="profile-info">
    <h3>Jose Canizares</h3>
    <h3>Web Developer</h3>
    <p>@josecani</p>
  </div>
);

const ProfileStatistics = props => (
  <div class="profile-statistics">
    <h3>Created 2 pages</h3>
  </div>
);

export default class Profile extends Component {
  render() {
    return (
      <div class="profile">
        <ProfileHeader />
        <ProfileInfo />
        <ProfileStatistics />
      </div>
    );
  }
}

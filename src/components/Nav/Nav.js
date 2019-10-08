import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { ReactComponent as SkillSenseLogo } from '../../skillSenseLogo.svg';

const Nav = (props) => (
  <div className="nav">
    <Link to="/home">
      <SkillSenseLogo alt="skill-sense logo" className="logo"/>
    </Link>
    <div className="nav-right">
      <Link className="nav-link" to="/home">
        {/* Show this link if they are logged in or not,
        but call this link 'Home' if they are logged in,
        and call this link 'Login / Register' if they are not */}

        {props.user.id ? 'My Profile' : 'Login / Register'}
      </Link>
      {/* Always show this link since the about page is not protected */}
      {/* <Link className="nav-link" to="/about">
        About
      </Link> */}

      {props.user.access_id === 1 || props.user.access_id === 2 && <Link className="nav-link" to="/mentors">
        My Mentorships
      </Link>}
      {props.user.access_id === 1 && <Link className="nav-link" to="/search/mentors">
        Mentor Search
          </Link>}
      {props.user.access_id === 1 || props.user.access_id === 3 && <Link className="nav-link" to="/jobs">
        My Jobs
          </Link>}
      {props.user.access_id === 1 && <Link className="nav-link" to="/search/jobs">
        Job Search
      </Link>}
      {/* Show the link to the info page and the logout button if the user is logged in */}
      {props.user.id && (
        <>
          {/* <Link className="nav-link" to="/info">
            Info Page
          </Link> */}

          <LogOutButton className="nav-link" />
        </>
      )}
    </div>
  </div>
);

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Nav);

import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import { addSpeaker } from "../actions/voicelines";

export const Speaker = (props) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  return (
  
<div>
  { !props.speaker.id ? (<div>

    <div className="card text-center mt-5">
    <div className="card-header">
    Register
   </div>
   <div className="card-body">
    <h5 className="card-title">Contribute your voice</h5>

     <form
      onSubmit={(e) => {
        e.preventDefault();
        props.addSpeaker({ age, gender });
      }}
    >

      <input className="form-control my-3 px-3" value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        type="number"
        name="Age"
        required />
      <div>
        <select
          className="form-control my-3 px-3"
          onChange={(e) => setGender(e.target.value)}
          name="gender"
        >
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>

  </div>
  <div class="card-footer text-muted">
  Voice is natural, voice is human.
  </div>
</div>

  

  </div>):<></>}
</div>
    
 




  );
};

Speaker.propTypes = {
  speaker: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  speaker: state.voicelines.speaker,
});

export default connect(mapStateToProps, { addSpeaker })(Speaker);

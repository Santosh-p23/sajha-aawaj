import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link , Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'

import {addSpeaker} from '../actions/voicelines'


export const Speaker = (props) => {

    const [age, setAge] = useState(0);
    const[gender, setGender] = useState('');

  return (
    <form onSubmit = {(e) => { e.preventDefault()
                              props.addSpeaker({age, gender})} }>
    <input
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="Age"
          type="number"
          name="Age"
          required
        />
        <div>
            <select className="form-control"
              onChange={e => setGender(e.target.value)}
              name="gender">
              <option value="">---</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
        <button type="submit">Submit</button>
      </form>
 
  )
}

Speaker.propTypes = {
}

const mapStateToProps = (state) => ({
})


export default connect(mapStateToProps, { addSpeaker})(Speaker)
import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import {
  getListenSnippets,
  putListenSnippet,
} from "../actions/voicelines";

export const Listen = (props) => {
  const [snippet, setSnippet] = useState(null);

  useEffect(() => {
    props.getListenSnippets();
    console.log(props.snippets);
  }, []);


  return (
    <div>
      {props.snippets.results ? (
        props.snippets.results.map((snippet, key) => (
          <div key={snippet.id}>
            <h1>{snippet.text.text}</h1>
            <h2>Listen here {snippet.speech.audiofile}</h2>
            <audio controls>
  <            source src={snippet.speech.audiofile} type="audio/ogg"></source>
            </audio>
            <button
              onClick={
                 (e) => {
                  e.preventDefault();

                  
                  props.putListenSnippet(snippet.id,{ is_rejected: false } );
                }
              }
            >
              yes
            </button>
            <button onClick={(e)=>{
                e.preventDefault();

                  
                props.putListenSnippet(snippet.id,{is_rejected: true} );
            }}>
                NO</button>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

Listen.propTypes = {
  snippets: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  snippets: state.voicelines.snippets,
});



export default connect(mapStateToProps, {
    getListenSnippets,
    putListenSnippet,
  }) (Listen);
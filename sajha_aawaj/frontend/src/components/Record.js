import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import {
  getRecordSnippets,
  putRecordSnippet,
  addSpeech,
} from "../actions/voicelines";

export const Record = (props) => {
  const [voicelines, setVoicelines] = useState([]);
  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    props.getRecordSnippets();
    console.log(props.snippets);
  }, []);

  const onChange = (e) => {
    setSpeech(e.target.value);
  };

  return (
    <div>
      {props.snippets.results ? (
        props.snippets.results.map((snippet, key) => (
          <div key={snippet.id}>
            <h1>{snippet.text.text}</h1>
            <h2>Record here</h2>
            <input
              type="file"
              multiple={false}
              accept=".wav"
              onChange={(e) => {
                setSpeech(e.target.files[0]);
              }}
            />
            <button
              onClick={
                 (e) => {
                  e.preventDefault();

                  const data = { speaker: props.speaker.id, audio: speech, snippetID: snippet.id };
                  props.addSpeech(data);
                }
              }
            >
              Save
            </button>
            <button onClick={(e)=>{}}>Edit</button>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

Record.propTypes = {
  snippets: PropTypes.object.isRequired,
  speaker: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  snippets: state.voicelines.snippets,
  speaker: state.voicelines.speaker,
});

export default connect(mapStateToProps, {
  getRecordSnippets,
  putRecordSnippet,
  addSpeech,
})(Record);

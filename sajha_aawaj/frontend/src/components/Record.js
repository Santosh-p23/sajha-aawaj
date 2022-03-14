import React, { Component, useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import Speaker from './Speaker'
import {
  getRecordSnippets,
  putRecordSnippet,
  addSpeech,
} from "../actions/voicelines";

export const Record = (props) => {
  const audioRef = useRef();

  const [count, setCount] = useState(0);
  const [speech, setSpeech] = useState(null);
  const [recordState, setRecordState] = useState(null);
  const [speaker, setSpeaker] = useState(false);


  const updateSong = (source) => {
    setSpeech(source);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      //audioRef.current.play();
    }
  };

  useEffect(() => {
    props.getRecordSnippets();
    console.log(props.snippets);
  }, []);

  const onChange = (e) => {
    setSpeech(e.target.value);
  };

  const start_stop = () => {
    if (recordState == RecordState.START) {
      setRecordState(RecordState.STOP);
    } else {
      setRecordState(RecordState.START);
    }
  };

  const onStop = (blob) => {
    console.log("audioData", blob);
    updateSong(blob);
  };


  return (
    // <div>
    //   {props.snippets.results ? (
    //     props.snippets.results.map((snippet, key) => (
    //       <div key={snippet.id}>
    //         <h1>{snippet.text.text}</h1>
    //         <h2>Record here</h2>
    //         <input
    //           type="file"
    //           multiple={false}
    //           accept=".wav"
    //           onChange={(e) => {
    //             setSpeech(e.target.files[0]);
    //           }}
    //         />
    //         <button
    //           onClick={
    //              (e) => {
    //               e.preventDefault();

    //               const data = { speaker: props.speaker.id, audio: speech, snippetID: snippet.id };
    //               props.addSpeech(data);
    //             }
    //           }
    //         >
    //           Save
    //         </button>
    //         <button onClick={(e)=>{}}>Edit</button>
    //       </div>
    //     ))
    //   ) : (
    //     <></>
    //   )}
    // </div>
    <div>
      <Speaker />
      { props.speaker.id && props.snippets.results && count < 5 ? (
        <div className="card text-center mt-5">
          <div className="card-header">
            Click 🎙 and then read the sentence aloud.
          </div>

          <div className="card-body">
            <div className="card text-center my-5">
              <div className="card-body">
                <h1 className="card-title">
                  {props.snippets.results[count].text.text}
                </h1>
              </div>
            </div>

            <div className="text-center">
              <AudioReactRecorder
                backgroundColor="rgb(255,255,255)"
                canvasWidth="250"
                canvasHeight="100"
                state={recordState}
                onStop={onStop}
              />

              <button
                className="btn btn-primary mx-3 my-3"
                onClick={start_stop}
              >
                🎙
              </button>

              <button
                className="btn btn-danger mx-3 my-3"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(speech.url)              
                  // const file = new File([speech], 'recording.wav',{type: 'audio/wav;' })
                  var file = new File([speech], 'recording.wav' ,{type: "audio/wav"});

                  console.log(file)
                  
                  const data = {
                    speaker: props.speaker.id,
                    audio: speech.blob,
                    snippetID: props.snippets.results[count].id,
                  };
                  props.addSpeech(data);
                  setSpeech(null);
                  setCount(count + 1);
                }}
              >
                <i className="fas fa-save"></i>
              </button>

              {speech ? (
                <div className="text-center mx-3 my-3">
                  {" "}
                  <audio controls ref={audioRef}>
                    <source src={speech.url} type="audio/wav" />
                  </audio>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="card-footer text-muted">
            <button
              className="btn btn-link"
              onClick={(e) => {
                e.preventDefault();
                setRecordState(RecordState.NONE);
                setSpeech(null);
                setCount(count + 1);
              }}
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div>
          {count >= 5 ? (
            <div class="card text-center mx-3 my-3">
              <div class="card-body">
                <h5 class="card-title">Thank you for your contribution !</h5>
                <button class="btn btn-outline-primary my-3" onClick= {(e)=>{
                  e.preventDefault();
                  props.getRecordSnippets();
                  setCount(0);
                }}>
                🎙 Ready to do 5 more ?
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
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

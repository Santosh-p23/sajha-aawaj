import React, { Component, useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import {
  getListenSnippets,
  putListenSnippet,
} from "../actions/voicelines";

export const Listen = (props) => {

  const audioRef = useRef();

  
  const [ count, setCount] = useState(0);
  const [speech, setSpeech] = useState(null);

  

  useEffect(() => {
    props.getListenSnippets();
    console.log(props.snippets);
  }, []);

  const updateSong = (source) => {

    setSpeech(source);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  };


  return (
  //   <div>
  //     {props.snippets.results ? (
  //       props.snippets.results.map((snippet, key) => (
  //         <div key={snippet.id}>
  //           <h1>{snippet.text.text}</h1>
  //           <h2>Listen here {snippet.speech.audiofile}</h2>
  //           <audio controls>
  // <            source src={snippet.speech.audiofile} type="audio/ogg"></source>
  //           </audio>
  //           <button
  //             onClick={
  //                (e) => {
  //                 e.preventDefault();

                  
  //                 props.putListenSnippet(snippet.id,{ is_rejected: false } );
  //               }
  //             }
  //           >
  //             yes
  //           </button>
  //           <button onClick={(e)=>{
  //               e.preventDefault();

                  
  //               props.putListenSnippet(snippet.id,{is_rejected: true} );
  //           }}>
  //               NO</button>
  //         </div>
  //       ))
  //     ) : (
  //       <></>
  //     )}
  //   </div>

<div>
      {props.snippets.results && count < 5 ? (
        <div className="card text-center mt-5">
          <div className="card-header">
          Listen ! Did they accurately speak the sentence?
          </div>

          <div className="card-body">
            <div className="card text-center my-5">
              <div className="card-body">
                <h1 className="card-title">
                  {props.snippets.results[count].text.text}
                </h1>
              </div>
            </div>


            <div className="text-center mx-3 my-3">
                   <audio controls key ={props.snippets.results[count].speech.id}> 
                   <source src={props.snippets.results[count].speech.audiofile} type="audio/wav" />
                  </audio>
                </div>

            <div className="text-center">

              <button
                className="btn btn-success mx-3 my-3"
                onClick={(e)=>{
                  e.preventDefault();
                  props.putListenSnippet(props.snippets.results[count].id,{ is_rejected: false } );
                  setCount(count+1);
                  updateSong(props.snippets.results[count].speech.audiofile);

                }}
              >
                <i className="fa-solid fa-check"></i>
              </button>

              <button
                className="btn btn-danger mx-3 my-3"
                onClick={(e) => {
                  e.preventDefault();
                  props.putListenSnippet(props.snippets.results[count].id,{is_rejected: true} );
                  setCount(count + 1);
                  updateSong(props.snippets.results[count].speech.audiofile);


                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              
               
            </div>
          </div>
          <div className="card-footer text-muted">
            <button
              className="btn btn-link"
              onClick={(e) => {
                e.preventDefault();
                setCount(count + 1);
                console.log('aalooo')
                console.log(props.snippets.results[count].speech.audiofile);
              }}
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div>
          {count >= 5 ? (
            <div className="card text-center mx-3 my-3">
              <div className="card-body">
                <h5 className="card-title">Thank you for your contribution !</h5>
                <button className="btn btn-outline-primary my-3" onClick= {(e)=>{
                  e.preventDefault();
                  props.getListenSnippets();
                  setCount(0);
                }}>
                🎙 Ready to listen 5 more ?
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
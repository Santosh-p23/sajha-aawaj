import React, { Component, useEffect, useState, useRef } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import axios from "axios";

const SpeechToText = (props) => {
  const audioRef = useRef();

  const [recordState, setRecordState] = useState(null);
  const [speech, setSpeech] = useState(null);
  const [isRecorded, setIsRecorded] = useState(false);
  const [model2, setModel2] = useState('');
  const [text, setText] = useState("");

  const postSpeechToText = (data) => {
    let form_data = new FormData();
    var url_path;
    if (isRecorded) {
      form_data.append("audiofile", data.audiofile, "audiofile.wav");
    } else {
      form_data.append("audiofile", data.audiofile);
    }

    if(model2=='option2'){
    url_path =`/api/speech_to_text2/`;
    }
    else{
    url_path = `/api/speech_to_text/`;
    }

    axios
      .post(url_path, form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data.text);
        setText(res.data);
      })
      .catch((err) => console.log("error", err));
  };

  const updateSong = (source) => {
    setSpeech(source);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
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
    setIsRecorded(true);
    updateSong(blob);
  };

  return (
    // <div>
    //   <h1>Speech To Text: Record Voice here</h1>
    //   <input
    //     type="file"
    //     multiple={false}
    //     accept=".wav"
    //     onChange={(e) => {
    //       setSpeech(e.target.files[0]);
    //     }}
    //   />
    //   <button
    //     onClick={(e) => {
    //       e.preventDefault();
    //       console.log("print here");
    //       postSpeechToText({ audiofile: speech });
    //     }}
    //   >
    //     Save
    //   </button>
    //   <textarea
    //     value={text.text}
    //     onChange={(e) => {
    //       setText(e.target.value);
    //     }}
    //   ></textarea>
    //           <AudioReactRecorder
    //             backgroundColor="rgb(255,255,255)"
    //             canvasWidth="250"
    //             canvasHeight="100"
    //             state={recordState}
    //             onStop={onStop}
    //           />
    //           <button
    //             className="btn btn-primary mx-3 my-3"
    //             onClick={start_stop}
    //           >
    //             🎙
    //           </button>

    // </div>

    <div className="card text-center mt-5">
      <div className="card-header">Speech To Text</div>

      <div className="card-body">


          <fieldset className="form-group">
      <legend className="mt-1">Models</legend>
      <div className="form-check">
        <label className="form-check-label">
          <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" onChange={(e)=>{
            setModel2(e.target.value);
          }} />
          Wav2Vec 2.0
        </label>
      </div>
      <div className="form-check">
        <label className="form-check-label">
          <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2" onChange={(e)=>{
            setModel2(e.target.value);
          }}/>
          End To End ASR
        </label>
      </div>
        </fieldset>
        <div className="card text-center">
          <div className="card-body">




            <div className="row">
              <div className="col-md-6">
                <div class="form-group">
                  <label for="formFile" class="form-label mt-4">Upload your speech</label>
                  <input
                    class="form-control"
                    type="file"
                    multiple={false}
                    accept=".wav"
                    onChange={(e) => {
                      setIsRecorded(false);
                      setSpeech(e.target.files[0]);
                    }}
                  />

                  <button
                    className="btn btn-outline-info mt-3"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("print here");
                      postSpeechToText({ audiofile: speech });
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="col-md-6">
              <h5 className="card-title mt-3">Record</h5>
                <div className="text-center">
                  <AudioReactRecorder
                    backgroundColor="rgb(255,255,255)"
                    canvasWidth="125"
                    canvasHeight="50"
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

                      postSpeechToText({ audiofile: speech.blob });
                      setSpeech(null);
                    }}
                  >
                    <i className="fas fa-save"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div class="form-group px-4">
          <label class="form-label mt-2">
            Text
          </label>
          <textarea
            class="form-control"
            id="exampleTextarea"
            rows="5"
            value={text.text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;

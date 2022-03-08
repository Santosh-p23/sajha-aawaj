import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'


const SpeechToText= (props) => {

    const [speech, setSpeech] = useState('');
    const [text, setText] = useState('')

    const postSpeechToText = (data) =>{

        let form_data = new FormData();
        form_data.append('audiofile', data.audiofile);
        axios.post(`/api/speech_to_text/`, form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then((res) => {
               console.log(res.data.text)
               setText(res.data.text)
    
            })
            .catch(err => console.log("error", err));
    
        }




  return (
    <div>
        <h1>Speech To Text: Record Voice here</h1>
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
                  console.log("print here")
                  postSpeechToText({audiofile: speech});
                }
              }
            >
              Save
            </button>
              <textarea value ={text}
              onChange ={(e)=>{setText(e.target.value) }}>
              </textarea>
    </div>
  )
}

export default SpeechToText
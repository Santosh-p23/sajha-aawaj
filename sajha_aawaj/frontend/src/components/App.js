import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Routes, Redirect } from 'react-router-dom'


import {Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import {Provider} from 'react-redux'
import store from '../store'

import Record from '../components/Record'
import Listen from '../components/Listen'
import Speaker from '../components/Speaker'
import SpeechToText from '../components/SpeechToText'

const options ={
    timeout: 3000,
    position:'top center'
    
}

export default function App() {
  return(
    <Provider store ={store} >
            <AlertProvider template ={ AlertTemplate }{...options}>
            <Router>
               
            <Fragment>
                <div className ="container">
                    <Routes>
                        <Route path ="/record" element ={ <Record /> } />
                        <Route path ="/setSpeaker" element ={ <Speaker /> } />
                        <Route path ="/listen" element ={ <Listen /> } />
                        <Route path ="/speechtotext" element ={ <SpeechToText /> } />
                    </Routes>
                </div>
            </Fragment>
            </Router>

            </AlertProvider>
            </Provider>


        )
}

ReactDOM.render(<App />, document.getElementById('app'))
import axios from 'axios'
import { GET_LISTEN_SNIPPET, GET_LISTEN_SNIPPETS, PUT_LISTEN_SNIPPET, GET_ERRORS, GET_RECORD_SNIPPET, GET_RECORD_SNIPPETS, ADD_SPEAKER, ADD_SPEECH, GET_SPEECH, PUT_RECORD_SNIPPET } from './types'
import { createMessages, returnErrors } from './messages'

export const getListenSnippets = () => (dispatch, getState) => {
    axios.get(`/api/snippet_listen`)
        .then(res => {
            dispatch({
                type: GET_LISTEN_SNIPPETS,
                payload: res.data
            })
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const getListenSnippet = (id) => (dispatch, getState) => {
    axios.get(`/api/snippet_listen/${id}`)
        .then(res => {
            dispatch({
                type: GET_LISTEN_SNIPPET,
                payload: res.data
            })
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const putListenSnippet = (id, data) => (dispatch, getState) => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(data);
    axios.patch(`/api/snippet_listen/${id}/`, body, config)
        .then(res => {
            dispatch({
                type: PUT_LISTEN_SNIPPET,
                payload: res.data
            })

            dispatch(createMessages({ listenSnippet: `Snippet ${id} updated` }))
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const getRecordSnippet = (id) => (dispatch, getState) => {
    axios.get(`/api/snippet_record/${id}`)
        .then(res => {
            dispatch({
                type: GET_RECORD_SNIPPET,
                payload: res.data
            })
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const getRecordSnippets = () => (dispatch, getState) => {
    axios.get(`/api/snippet_record/`)
        .then(res => {
            dispatch({
                type: GET_RECORD_SNIPPETS,
                payload: res.data
            })
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const putRecordSnippet = (id, data) => (dispatch, getState) => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(data);
    axios.patch(`/api/snippet_record/${id}/`, body, config)
        .then(res => {
            dispatch(createMessages({ recordSnippet: `Snippet ${id} updated` }))
            dispatch({
                type: PUT_RECORD_SNIPPET,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
    // dispatch(returnErrors(err.response.data, err.response.status)));
}


export const addSpeaker = (data) => (dispatch, getState) => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(data)
    console.log(body)
    axios
        .post(`/api/speaker/`, body, config)
        .then((res) => {
            dispatch({
                type: ADD_SPEAKER,
                payload: res.data
            });
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));

}


export const addSpeech = (data) => (dispatch, getState) => {

    let form_data = new FormData();
    console.log(data.audio);
    form_data.append('audiofile', data.audio, 'recording.wav');
    form_data.append('speaker', data.speaker);

    axios
        .post(`/api/speech/`, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        .then((res) => {
            dispatch({
                type: ADD_SPEECH,
                payload: res.data
            });


            dispatch(putRecordSnippet(data.snippetID, { speech: res.data.id }))


        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));

}


export const putSpeech = (id, data) => (dispatch, getState) => {

    let form_data = new FormData();
    form_data.append('audiofile', data.audio);
    form_data.append('speaker', data.speaker);
    axios
        .post(`/api/speech/${id}`, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        .then((res) => {
            dispatch({
                type: ADD_SPEECH,
                payload: res.data
            });

        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));

}

export const getSpeech = (id) => (dispatch, getState) => {
    axios.get(`/api/speech/${id}`)
        .then(res => {
            dispatch({
                type: GET_SPEECH,
                payload: res.data
            })
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}
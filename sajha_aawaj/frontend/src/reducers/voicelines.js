import { GET_LISTEN_SNIPPET, GET_LISTEN_SNIPPETS, PUT_LISTEN_SNIPPET, GET_RECORD_SNIPPETS, GET_RECORD_SNIPPET, PUT_RECORD_SNIPPET, ADD_SPEAKER, ADD_SPEECH, GET_SPEECH } from "../actions/types";

const initialState = {
    snippets: {},
    speaker: {},
    snippet: {},
    speech: {}
};

export default function(state = initialState, action) {

    switch (action.type) {
        case GET_RECORD_SNIPPETS:
        case GET_LISTEN_SNIPPETS:
            return {
                ...state,
                snippets: action.payload
            }

        case GET_RECORD_SNIPPET:
        case GET_LISTEN_SNIPPET:
            return {
                ...state,
                snippet: action.payload
            }



        case ADD_SPEECH:
        case GET_SPEECH:
            return {
                ...state,
                speech: action.payload
            }
        case ADD_SPEAKER:
            console.log(action.payload);
            return {
                ...state,
                speaker: action.payload
            }


        case PUT_LISTEN_SNIPPET:
        case PUT_RECORD_SNIPPET:
        default:
            return state;
    }
}
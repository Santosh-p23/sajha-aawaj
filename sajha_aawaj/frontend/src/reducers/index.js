import { combineReducers, combnineReducers } from 'redux'
import voicelines from './voicelines'
import errors from './errors'
import messages from './messages'

export default combineReducers({
    voicelines,
    errors,
    messages
});
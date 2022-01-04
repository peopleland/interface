import {createSlice} from "@reduxjs/toolkit";

export interface SignActionState  {
  readonly action: boolean
  callback?: string
}

const initialState: SignActionState = {
  action: false,
}

export const signAction = createSlice({
  name: 'signAction',
  initialState,
  reducers: {
    actionSign(state, actions) {
      const {action, callback} = actions.payload
      state.action = action
      state.callback = callback
    }
  }
})

export const {actionSign} = signAction.actions
export default signAction.reducer

import {createSlice} from "@reduxjs/toolkit";

export interface SignActionState  {
  readonly action: boolean
}

const initialState: SignActionState = {
  action: false,
}

export const signAction = createSlice({
  name: 'signAction',
  initialState,
  reducers: {
    actionSign(state, action) {
      state.action = action.payload
    }
  }
})

export const {actionSign} = signAction.actions
export default signAction.reducer

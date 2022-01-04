import {createSlice} from "@reduxjs/toolkit";

export interface WalletModalState  {
  readonly visible: boolean
  thenSign?: boolean
  callback?: string
}

const initialState: WalletModalState = {
  visible: false,
}

export const walletModal = createSlice({
  name: 'walletModal',
  initialState,
  reducers: {
    actionModal(state, action) {
      const {visible, thenSign, callback} = action.payload
      state.visible = visible
      state.thenSign = thenSign
      state.callback = callback
    }
  }
})

export const {actionModal} = walletModal.actions
export default walletModal.reducer

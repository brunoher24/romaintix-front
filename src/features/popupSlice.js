import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  show: false,
  title: "",
  text: "",
};

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    show: (state, action) => {
      const {title, text} = action.payload
        state.show = true;
        state.title = title;
        state.text = text;
    },
    hide: (state) => {  
      state.show = false;
      state.title = "";
      state.text = "";
    },
  },
})

// Action creators are generated for each case reducer function
export const { show, hide } = popupSlice.actions
export const selectPopup = state => state.popup;


export default popupSlice.reducer
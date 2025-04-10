import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage on initial state
const initialState = {
  currentTeam: JSON.parse(localStorage.getItem('currentTeam')) || null
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
      localStorage.setItem('currentTeam', JSON.stringify(action.payload));
    },
    clearCurrentTeam: (state) => {
      state.currentTeam = null;
      localStorage.removeItem('currentTeam');
    },
    triggerRefetch: (state) => {
      // This is just a flag to trigger useEffect in Sidebar
      state.refetchFlag = !state.refetchFlag;
    }
  }
});

export const { setCurrentTeam, clearCurrentTeam, triggerRefetch } = teamSlice.actions;
export default teamSlice.reducer;
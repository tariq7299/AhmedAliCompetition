import React, { useReducer } from 'react';
import { useAuth } from './AuthProvider';

// Define AppContext
const AppContext = React.createContext();

// Define default state
const defaultAppState = {
  mainFetchingLoader: false,
  mainFetchingLoaderMsg: '',
  mainFetchingIcon: null,
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case 'FETCHING':
      return {
        ...state,
        mainFetchingLoader: action.payload.loader,
        mainFetchingLoaderMsg: action.payload.msg || 'جاري معالجة البيانات',
        mainFetchingIcon: action.payload.icon,
      };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [appState, dispatchAppState] = useReducer(appReducer, defaultAppState);
  const { axiosPrivate } = useAuth();

  const setMainLoaderHandler = (loader, msg, icon) => {
    dispatchAppState({ type: 'FETCHING', payload: { loader, msg, icon } });
  };

  const appContext = {
    ...appState,
    setMainLoader: setMainLoaderHandler,
    axiosPrivate,
  };

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
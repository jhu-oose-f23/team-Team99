import React, { createContext, useContext } from 'react';
import Toast from 'react-native-toast-message';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={Toast.show}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};
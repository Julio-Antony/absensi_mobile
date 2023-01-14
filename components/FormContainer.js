import React from 'react';
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const FormContainer = ({ children }) => {
  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 840,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    marginTop: 30,
    padding: 30
  },
});

export default FormContainer;

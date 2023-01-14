import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { isValidEmail, isValidObjField, updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { StackActions } from '@react-navigation/native';

import { Formik } from 'formik';
import * as Yup from 'yup';

import client from '../api/client';

const validationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, 'Invalid name!')
    .required('Name is required!'),
  email: Yup.string().email('Invalid email!').required('Email is required!'),
  password: Yup.string()
    .trim()
    .min(8, 'Password is too short!')
    .required('Password is required!'),
  confirm: Yup.string().equals(
    [Yup.ref('password'), null],
    'Password does not match!'
  ),
});

const SignupForm = ({ navigation }) => {
  const userInfo = {
    nip: '311810297',
    username: '',
    email: '',
    password: '',
    confirm: '',
  };

  const [error, setError] = useState('');

  const { username, email, password, confirm } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    // we will accept only if all of the fields have value
    if (!isValidObjField(userInfo))
      return updateError('Required all fields!', setError);
    // if valid name with 3 or more characters
    if (!username.trim() || username.length < 3)
      return updateError('Invalid name!', setError);
    // only valid email id is allowed
    if (!isValidEmail(email)) return updateError('Invalid email!', setError);
    // password must have 8 or more characters
    if (!password.trim() || password.length < 8)
      return updateError('Password is less then 8 characters!', setError);
    // password and confirm password must be the same
    if (password !== confirm)
      return updateError('Password does not match!', setError);

    return true;
  };

  const sumbitForm = () => {
    if (isValidForm()) {
      // submit form
      console.log(userInfo);
    }
  };

  const signUp = async (values, formikActions) => {
    const res = await client.post('/users', {
      ...values,
    });
    console.log(res.data)
    if (res.data) {
      const signInRes = await client.post('/auth', {
        email: values.email,
        password: values.password,
      });
      if (signInRes.data) {
        navigation.dispatch(
          StackActions.replace('ImageUpload', {
            token: signInRes.data.token,
            id: signInRes.data.user._id
          })
        );
      }
    }

    formikActions.resetForm();
    formikActions.setSubmitting(false);
  };

  return (
    <FormContainer>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={signUp}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          const { username, email, password, confirm } = values;
          return (
            <>
              <FormInput
                value={username}
                error={touched.username && errors.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                label='username'
                placeholder='John Smith'
              />
              <FormInput
                value={email}
                error={touched.email && errors.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize='none'
                label='Email'
                placeholder='example@email.com'
              />
              <FormInput
                value={password}
                error={touched.password && errors.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                autoCapitalize='none'
                secureTextEntry
                label='Password'
                placeholder='********'
              />
              <FormInput
                value={confirm}
                error={touched.confirm && errors.confirm}
                onChangeText={handleChange('confirm')}
                onBlur={handleBlur('confirm')}
                autoCapitalize='none'
                secureTextEntry
                label='Confirm Password'
                placeholder='********'
              />
              <FormSubmitButton
                submitting={isSubmitting}
                onPress={handleSubmit}
                title='Sign up'
              />
            </>
          );
        }}
      </Formik>
    </FormContainer>
  );
};

const styles = StyleSheet.create({});

export default SignupForm;

import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import colors from '@utils/colors';
import WelcomeHeader from '@ui/WelcomeHeader';
import FormInput from '@ui/FormInput';
import AppButton from '@ui/AppButton';
import FormDivider from '@ui/FormDivider';

interface Props {}

const SignIn: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <WelcomeHeader /> 

      <View style={styles.formContainer}>
        <FormInput placeholder='Email' keyboardType='email-address' autoCapitalize='none' />
        <FormInput placeholder='Password' secureTextEntry={true}/>

        <AppButton title='Sign In' />

        <FormDivider />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 15,
    },
    formContainer: {
      marginTop: 30,
    }
});

export default SignIn;
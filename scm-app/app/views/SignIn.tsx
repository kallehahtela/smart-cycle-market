import { View, StyleSheet } from 'react-native'
import React, { FC, useState } from 'react'
import WelcomeHeader from '@ui/WelcomeHeader';
import FormInput from '@ui/FormInput';
import AppButton from '@ui/AppButton';
import FormDivider from '@ui/FormDivider';
import FormNavigator from '@ui/FormNavigator';
import CustomKeyAvoidingView from '@ui/CustomKeyAvoidingView';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from 'app/navigator/AuthNavigator';
import { signInSchema, yupValidate } from '@utils/validator';
import { showMessage } from 'react-native-flash-message';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import axios from 'axios';
import client from 'app/api/client';

interface Props {}

export interface SignInRes {
  profile: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

const SignIn: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const [userInfo, setUserInfo] = useState({
    email: '', 
    password: ''
  });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(signInSchema, userInfo);
    
    if (error) return showMessage({ message: error, type: 'danger' });
    
    setBusy(true);
    const res = await runAxiosAsync<SignInRes>(
      client.post('/auth/sign-in', values)
    );

    if (res) {
      // store teh tokens
      console.log(res);
    }
    setBusy(false);
  };

  const handleChange = (name: string) => (text: string) => {
    setUserInfo({...userInfo, [name]: text});
  };

  const { email, password } = userInfo;

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
          <WelcomeHeader /> 

          <View style={styles.formContainer}>
            <FormInput placeholder='Email' keyboardType='email-address' autoCapitalize='none' value={email} onChangeText={handleChange('email')}/>
            <FormInput placeholder='Password' secureTextEntry={true} value={password} onChangeText={handleChange('password')}/>

            <AppButton active={!busy} title='Sign In' onPress={handleSubmit}/>

            <FormDivider />
            <FormNavigator 
              onLeftPress={() => navigate('ForgetPassword')}
              onRightPress={() => navigate('SignUp')}
              leftTitle='Forget Pass'
              rightTitle='Sign Up'
            /> 
          </View>
        </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    innerContainer: {
      padding: 15,
      flex: 1,
    },
    formContainer: {
      marginTop: 30,
      flex: 1,
    }
});

export default SignIn;
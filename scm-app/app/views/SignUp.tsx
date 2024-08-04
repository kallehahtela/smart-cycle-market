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
import { newUserSchema, yupValidate } from '@utils/validator';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { showMessage } from 'react-native-flash-message';
import client from 'app/api/client';
import useAuth from 'app/hooks/useAuth';

interface Props {}

const SignUp: FC<Props> = () => {
  const [userInfo, setUserInfo] = useState({
    name: '', 
    email: '', 
    password: ''
  });

  const [busy, setBusy] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>(); 
  const { signIn } = useAuth();

  const { email, name, password } = userInfo;

  const handleChange = (name: string) => (text: string) => {
    setUserInfo({...userInfo, [name]: text});
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);
    
    if (error) return showMessage({message: error, type: 'danger'});
    
    setBusy(true);
    const res = await runAxiosAsync<{message: string}>(
      client.post('/auth/sign-up', values)
    );

    if (res?.message) {
      showMessage({ message: res.message, type: 'success' });
      signIn(values!);
    }
    setBusy(false);
  };

  return (
    <CustomKeyAvoidingView>
        <View style={styles.innerContainer}>
          <WelcomeHeader /> 

          <View style={styles.formContainer}>
            <FormInput placeholder='Name' value={name} onChangeText={handleChange('name')}/>
            <FormInput placeholder='Email' value={email} keyboardType='email-address' autoCapitalize='none' onChangeText={handleChange('email')} />
            <FormInput placeholder='Password' value={password} secureTextEntry={true} onChangeText={handleChange('password')} />

            <AppButton active={busy} title='Sign Up' onPress={handleSubmit}/>

            <FormDivider />
            <FormNavigator 
              onLeftPress={() => navigate('ForgetPassword')}
              onRightPress={() => navigate('SignIn')}
              leftTitle='Forget Pass'
              rightTitle='Sign In'
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

export default SignUp;
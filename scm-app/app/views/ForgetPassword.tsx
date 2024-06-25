import { View, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import colors from '@utils/colors';
import WelcomeHeader from '@ui/WelcomeHeader';
import FormInput from '@ui/FormInput';
import AppButton from '@ui/AppButton';
import FormDivider from '@ui/FormDivider';
import FormNavigator from '@ui/FormNavigator';
import CustomKeyAvoidingView from '@ui/CustomKeyAvoidingView';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from 'app/navigator/AuthNavigator';

interface Props {}

const ForgetPassword: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>(); 

  return (
    <CustomKeyAvoidingView>
        <View style={styles.innerContainer}>
          <WelcomeHeader /> 

          <View style={styles.formContainer}>
            <FormInput placeholder='Email' keyboardType='email-address' autoCapitalize='none' />

            <AppButton title='Request Link' />

            <FormDivider />
            <FormNavigator 
              onLeftPress={() => navigate('SignUp')}
              onRightPress={() => navigate('SignIn')}
              leftTitle='Sign Up'
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

export default ForgetPassword;
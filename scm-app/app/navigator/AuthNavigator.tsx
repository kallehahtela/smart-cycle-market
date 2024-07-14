import { FC } from 'react'
import SignIn from '@views/SignIn';
import SignUp from '@views/SignUp';
import ForgetPassword from '@views/ForgetPassword';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ForgetPassword: undefined;
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {}

const AuthNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator
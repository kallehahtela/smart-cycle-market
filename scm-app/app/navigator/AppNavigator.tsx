import { FC } from 'react'
import SignIn from '@views/SignIn';
import SignUp from '@views/SignUp';
import ForgetPassword from '@views/ForgetPassword';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@views/Home';

export type AuthStackParamList = {
    Home: undefined;
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
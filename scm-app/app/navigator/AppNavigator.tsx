import { FC } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@views/Home';

export type AppStackParamList = {
    Home: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
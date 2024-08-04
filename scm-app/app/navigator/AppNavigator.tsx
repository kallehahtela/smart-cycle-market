import { FC } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@views/Home';
import Chats from '@views/Chats';
import ProductList from '@views/ProductList';

export type AppStackParamList = {
    Home: undefined;
    Chats: undefined;
    ProductList: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="ProductList" component={ProductList} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
import { StyleSheet } from 'react-native';
import { FC } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '@views/Profile';


const Stack = createNativeStackNavigator();

interface Props {}

const ProfileNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
    container: {},
});

export default ProfileNavigator;
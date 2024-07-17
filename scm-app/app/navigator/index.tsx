import { StyleSheet } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import colors from '@utils/colors';
import { FC } from 'react';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useSelector } from 'react-redux';
import { getAuthState } from 'app/store/auth';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

interface Props {}

const Navigator: FC<Props> = (props) => {
  const authState = useSelector(getAuthState);

  const loggedIn = authState.profile ? true : false;

  console.log(authState);

  return (
    <NavigationContainer theme={MyTheme}>
        {!loggedIn ? <AuthNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});

export default Navigator;
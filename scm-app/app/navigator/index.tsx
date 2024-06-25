import { StyleSheet } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import colors from '@utils/colors';
import { FC } from 'react';
import AuthNavigator from './AuthNavigator';


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

interface Props {}

const Navigator: FC<Props> = (props) => {
  return (
    <NavigationContainer theme={MyTheme}>
        <AuthNavigator/>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});

export default Navigator;
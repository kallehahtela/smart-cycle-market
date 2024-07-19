import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import colors from '@utils/colors';
import { FC, useEffect } from 'react';
import AuthNavigator from './AuthNavigator';
import { useDispatch } from 'react-redux';
import { Profile, updateAuthState } from 'app/store/auth';
import client from 'app/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import LoadingSpinner from '@ui/LoadingSpinner';
import useAuth from 'app/hooks/useAuth';
import TabNavigator from './TabNavigator';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

interface Props {}

const Navigator: FC<Props> = (props) => {
  const dispatch = useDispatch();

  const { loggedIn, authState } = useAuth();


  const fetchAuthState = async () => {
    const token = await AsyncStorage.getItem('access-token')
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));
      const res = await runAxiosAsync<{profile: Profile}>(client.get('/auth/profile', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }));

      if (res) {
        dispatch(updateAuthState({ pending: false, profile: res.profile }));
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
      }
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, [])

  console.log(authState);

  return (
    <NavigationContainer theme={MyTheme}>
      <LoadingSpinner visible={authState.pending} />
        {!loggedIn ? <AuthNavigator /> : <TabNavigator />}
    </NavigationContainer>
  );
};

export default Navigator;
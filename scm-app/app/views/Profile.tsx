import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform, RefreshControl } from 'react-native'
import React, { FC, useState } from 'react'
import AvatarView from './AvatarView';
import useAuth from 'app/hooks/useAuth';
import colors from '@utils/colors';
import size from '@utils/size';
import FormDivider from '@ui/FormDivider';
import ProfileOptionListItem from '@components/ProfileOptionListItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import { AntDesign } from '@expo/vector-icons';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import useClient from 'app/hooks/useClient';
import { ProfileRes } from 'app/navigator';
import { useDispatch } from 'react-redux';
import { updateAuthState } from 'app/store/auth';
import { showMessage } from 'react-native-flash-message';
import { selectImages } from '@utils/helper';
import mime from 'mime';
import LoadingSpinner from '@ui/LoadingSpinner';

interface Props {}

const Profile: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<ProfileNavigatorParamList>>()
  const { authState, signOut } = useAuth();
  const { profile } = authState;
  const [userName, setUserName] = useState(profile?.name || '');
  const [busy, setBusy] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { authClient } = useClient();
  const dispatch = useDispatch();

  const isNameChanged = profile?.name !== userName && userName.trim().length >= 3;

  const onMessagePress = () => {
    navigate('Chats');
  };

  const onListingPress = () => {
    navigate('Listings');
  };

  const fetchProfile = async () => {
    setRefreshing(true);
    const res = await runAxiosAsync<{ profile: ProfileRes }>(
      authClient.get('/auth/profile')
    );
    setRefreshing(false);
    if (res) {
      dispatch(
        updateAuthState({
          profile: {...profile!, ...res.profile},
           pending: false
          })
        );
    }
  };

  const getVerificvationLink = async () => {
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.get('/auth/verify-token')
    );

    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: 'success' });
    }
  };

  const handleProfileImageSelection = async () => {
    const [image] = await selectImages({
      allowsMultipleSelection: false, 
      allowsEditing: true, 
      aspect: [1, 1]
    });
    
    if (image) {
      const formData = new FormData();
      formData.append('avatar', {
        name: 'Avatar',
        uri: image,
        type: mime.getType(image),
      } as any);

      setUpdatingAvatar(true);
      const res = await runAxiosAsync<ProfileRes>(authClient.patch('/auth/update-avatar', formData));
      setUpdatingAvatar(false);
      if (res) {
        dispatch(updateAuthState({ 
          profile: {...profile!, ...res.profile }, 
          pending: false, })
        );
      }
    }
  };

  const updateProfile = async () => {
    const res = await runAxiosAsync<{profile: ProfileRes}>(authClient.patch('/auth/update-profile', { name: userName }))
    if (res) {
      showMessage({ message: 'Name updated successfully.', type: 'success' });
      dispatch(
        updateAuthState({
          pending: false,
          profile: { ...profile!, ...res.profile },
      })
    );
    }
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProfile} />} contentContainerStyle={styles.container}>
      {!profile?.verified && (
        <View 
          style={styles.verificationLinkContainer}
        >
        <Text 
          style={styles.verificationTitle}>
            It looks like your profile is not verified.
        </Text>
        { busy ? (<Text style={styles.verificationLink}>Please Wait...</Text> 
        ) : (<Text 
          onPress={getVerificvationLink} 
          style={styles.verificationLink}>
            Tap here to get the link.
        </Text>
      )}
      </View>
    )}

      {/* Profile image and profile info */}
      <View style={styles.profileContainer}>
        <AvatarView uri={authState.profile?.avatar} size={80} onPress={handleProfileImageSelection} />

        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <TextInput 
              value={userName}
              onChangeText={(text) => setUserName(text)}
              style={styles.name}
            />

            {isNameChanged && (
              <Pressable
                onPress={updateProfile}
              >
                <AntDesign 
                  name='check' 
                  size={24} 
                  color={colors.primary}
                />
              </Pressable>
            )}

          </View>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
      </View>

      <FormDivider />

      <ProfileOptionListItem 
        style={styles.marginBottom} 
        antIconName='message1' 
        title='Messages' 
        onPress={onMessagePress}
      />
      <ProfileOptionListItem 
        style={styles.marginBottom} 
        antIconName='appstore-o' 
        title='Your Listings'
        onPress={onListingPress}
      />
      <ProfileOptionListItem 
        antIconName='logout' 
        title='Log out'
        onPress={signOut}
      />

      <LoadingSpinner visible={updatingAvatar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  verificationLinkContainer: {
    marginTop: Platform.OS === 'ios' ? 10 : 35,
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: colors.deActive,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  verificationTitle: {
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  verificationLink: {
    fontWeight: '600',
    color: colors.active,
    textAlign: 'center',
    paddingTop: 5,
  },
  container: {
    padding: size.padding,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    paddingLeft: size.padding,
  },
  name: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    color: colors.primary,
    paddingTop: 2,
  },
  marginBottom: {
    marginBottom: 15,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Profile
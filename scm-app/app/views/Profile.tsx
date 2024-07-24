import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { FC } from 'react'
import AvatarView from './AvatarView';

interface Props {}

const Profile: FC<Props> = (props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AvatarView size={80}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export default Profile
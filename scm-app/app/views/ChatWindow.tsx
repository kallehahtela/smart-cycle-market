import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import AppHeader from '@components/AppHeader'
import BackButton from '@ui/BackButton'

interface Props {}

const ChatWindow: FC<Props> = (props) => {
  return (
    <View>
      <AppHeader  backButton={<BackButton />} />
    </View>
  );
};

const styles = StyleSheet.create({

});

export default ChatWindow
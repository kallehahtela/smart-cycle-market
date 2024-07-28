import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import AppHeader from '@components/AppHeader'
import BackButton from '@ui/BackButton'

interface Props {}

const Chats: FC<Props> = (props) => {
  return (

      <View>
        <AppHeader backButton={<BackButton />} />
      </View>
  )
}

export default Chats
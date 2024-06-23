import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'

interface Props {
    name: string;
}

const SignIn: FC<Props> = ({name}) => {
  return (
    <View style={styles.container}>
      <Text>Sign In</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {},
});

export default SignIn;
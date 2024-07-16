import { View, Text, StyleSheet } from 'react-native'
import { FC } from 'react'

interface Props {}

const Home: FC<Props> = (props) => {
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {},
});

export default Home
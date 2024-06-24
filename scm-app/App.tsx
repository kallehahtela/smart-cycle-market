import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import SignIn from '@views/SignIn';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SignIn />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
},
});

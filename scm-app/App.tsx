import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import Navigator from 'app/navigator';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Navigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
},
});

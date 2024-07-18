import { SafeAreaView, StyleSheet, Platform, StatusBar, Modal } from 'react-native';
import Navigator from 'app/navigator';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import store from 'app/store';

export default function App() {
  return (
    <Provider store={store}>
      {/*<Modal transparent/>*/}
      <SafeAreaView style={styles.container}>
        <Navigator />
        <FlashMessage position={'top'} />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
},
});

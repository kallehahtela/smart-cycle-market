import { View, StyleSheet, Modal } from 'react-native'
import { FC } from 'react'
import colors from '@utils/colors';
import LottieView from 'lottie-react-native';

interface Props {
  visible: boolean;
}

const LoadingSpinner: FC<Props> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Modal animationType='fade' transparent>
      <View style={styles.container}>
        <LottieView 
          source={require('../../assets/Animation.json')} 
          autoPlay 
          loop 
          style={{ flex: 1, transform: [{scale: .6}] }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backDrop,
  },
});

export default LoadingSpinner;
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { FC, ReactNode } from 'react'

interface Props {
    children: ReactNode;
}

const CustomKeyAvoidingView: FC<Props> = ({children}) => {
  return (
    <ScrollView>
        {children}
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding': 'height'} 
            style={styles.container}
            keyboardVerticalOffset={50}
        >
        </KeyboardAvoidingView>
    </ScrollView>
    
  );
};

const styles= StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default CustomKeyAvoidingView
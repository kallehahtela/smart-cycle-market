import { View, TextInput, StyleSheet, TextInputProps } from 'react-native'
import React, { FC, useState } from 'react'
import colors from '@utils/colors';

interface Props extends TextInputProps {}

const FormInput: FC<Props> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
        <TextInput 
          style={[styles.input, isFocused ? styles.borderActive : styles.borderDeactive]} 
          placeholderTextColor={colors.primary}
          onFocus={() => {
            setIsFocused(true)
          }}
          onBlur={() => {
            setIsFocused(false)
          }}
          {...props}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
      width: '100%',
      padding: 8,
      borderRadius: 5,
      marginBottom: 15,
  },
  borderDeactive: {
    borderWidth: 1,
    borderColor: colors.deActive,
  },
  borderActive: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

export default FormInput
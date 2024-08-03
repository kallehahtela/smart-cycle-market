import { Pressable, StyleSheet, Text } from 'react-native'
import React, { FC } from 'react'
import colors from '@utils/colors';

interface Props {
    title: string;
    active?: boolean;
    onPress?(): void;
}

const AppButton: FC<Props> = ({title, active, onPress}) => {
  return (
    <Pressable 
        onPress={!active ? onPress : null} 
        style={[styles.button, active ? styles.btnDeActive : styles.btnActive]}
    >
        <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    btnActive: {
        backgroundColor: colors.primary,
    },
    btnDeActive: {
        backgroundColor: colors.deActive,
    },
    title: {
        color: colors.white,
        fontWeight: '700',
        letterSpacing: 1,
    }
});

export default AppButton
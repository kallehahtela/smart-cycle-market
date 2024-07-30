import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { FC } from 'react'
import { Ionicons } from '@expo/vector-icons';
import colors from '@utils/colors';

interface Props {
    visible?: boolean; 
    onPress?(): void;
}

const OptionButton: FC<Props> = ({ visible, onPress }) => {

    if (!visible) return null;

    return (
        <Pressable onPress={onPress}>
            <Ionicons name='ellipsis-vertical-sharp' color={colors.primary} size={20} />
        </Pressable>
    );
};

const styles = StyleSheet.create({

});

export default OptionButton
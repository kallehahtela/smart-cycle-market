import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import colors from '@utils/colors';

interface Props {
    icon: JSX.Element;
    name: string;
}

const CategoryOption: FC<Props> = ({ icon, name }) => {
  return (
    <View style={styles.container}>
        <View style={styles.icon}>{icon}</View>
        <Text style={styles.category}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    category: {
        color: colors.primary,
        paddingVertical: 10,
    },
    icon: {
        transform: [{ scale: .5 }],
    }
});

export default CategoryOption
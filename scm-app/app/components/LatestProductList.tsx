import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import colors from '@utils/colors';
import ProductGridView from './ProductGridView';

export type LatestProduct = {
    id: string;
    name: string;
    thumbnail?: string;
    category: string;
    price: number;
};

interface Props {
    data: LatestProduct[];
    onPress(product: LatestProduct): void;
}

const LatestProductList: FC<Props> = ({ data, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Listed Offers</Text>
      <ProductGridView data={data} onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {

    },
    title: {
        fontWeight: '600',
        color: colors.primary,
        fontSize: 20,
        marginBottom: 15,
        letterSpacing: .5,
    },
});

export default LatestProductList
import { View, Text, StyleSheet, Pressable, Image, } from 'react-native'
import React, { FC } from 'react'
import { LatestProduct } from './LatestProductList';
import GridView from '@ui/GridView';
import { formatPrice } from '@utils/helper';
import colors from '@utils/colors';

interface Props {
    data: LatestProduct[];
    onPress(item: LatestProduct): void;
};

const ProductGridView: FC<Props> = ({ data, onPress }) => {
  return (
    <GridView

        data={data}
        renderItem={(item) => {
            return (
            <Pressable 
                onPress={() => onPress(item)} 
                style={styles.productContainer}
            >
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                <Text style={styles.name}>{item.name}</Text>
            </Pressable>
            );
        }}
    />
  );
};

const styles = StyleSheet.create({
    productContainer: {
        padding: 7,
    },
    thumbnail: {
        width: '100%',
        height: 100,
        borderRadius: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.active,
        paddingTop: 5,
    },
});

export default ProductGridView
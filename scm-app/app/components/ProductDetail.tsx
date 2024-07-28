import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { Product } from '@views/SingleProduct';
import { formatDate } from '@utils/date';

interface Props {
    product: Product;
}

const ProductDetail: FC<Props> = ({ product }) => {
  return (
    <View style={styles.container}>
        {/* Images */}
        <Text>{product.category}</Text>
        <Text>{product.price}</Text>
        <Text>Purchased on: {formatDate(product.date, 'dd LLLL yyyy')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {

    },
});

export default ProductDetail
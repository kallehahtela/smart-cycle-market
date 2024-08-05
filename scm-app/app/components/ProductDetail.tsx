import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { FC } from 'react'
import { formatDate } from '@utils/date';
import size from '@utils/size';
import AvatarView from '@views/AvatarView';
import colors from '@utils/colors';
import { formatPrice } from '@utils/helper';
import ImageSlider from './ImageSlider';
import { Product } from 'app/store/listings';

interface Props {
    product: Product;
}

const ProductDetail: FC<Props> = ({ product }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
          {/* Images */}
          <ImageSlider images={product.image} />

          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.date}>Purchased on: {formatDate(product.date, 'dd LLLL yyyy')}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.profileContainer}>
            <AvatarView uri={product.seller.avatar} size={60} />
            <Text style={styles.profileName}>{product.seller.name}</Text>
          </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: size.padding,
      flex: 1,
    },
    category: {
      marginTop: 15,
      color: colors.primary,
      fontWeight: '700'
    },
    price: {
      marginTop: 5,
      color: colors.active,
      fontWeight: '700',
      fontSize: 20,
    },
    name: {
      marginTop: 15,
      color: colors.primary,
      letterSpacing: 1,
      fontWeight: '700',
      fontSize: 20,
    },
    description: {
      marginTop: 15,
      color: colors.primary,
      letterSpacing: .5,
    },
    date: {
      marginTop: 5,
      color: colors.active,
      fontWeight: '700',
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    profileName: {
      paddingLeft: 15,
      color: colors.primary,
      letterSpacing: .5,
      fontWeight: '600',
      fontSize: 20,
    },
});

export default ProductDetail;
import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import ProductDetail from '@components/ProductDetail';

type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'SingleProduct'>

export type Product = {
    id: string;
    name: string;
    thumbnail?: string;
    category: string;
    price: number;
    image?: string[];
    date: string;
    description: string
    seller: {
      id: string;
      name: string;
      avatar?: string;
    };
};

const SingleProduct: FC<Props> = ({ route }) => {
    const { product } = route.params;
    
    return (
        <>
            <AppHeader backButton={<BackButton />} />
            <View style={styles.container}>
                {product ? <ProductDetail product={product} /> : <></>}
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: {

    },
});

export default SingleProduct
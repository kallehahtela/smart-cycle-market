import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import ProductDetail from '@components/ProductDetail';
import useAuth from 'app/hooks/useAuth';
import colors from '@utils/colors';
import OptionButton from '@ui/OptionButton';
import OptionModal from '@components/OptionModal';
import { Feather, AntDesign } from '@expo/vector-icons';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { showMessage } from 'react-native-flash-message';
import LoadingSpinner from '@ui/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { deleteItem, Product } from 'app/store/listings';

type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'SingleProduct'>

const menuOptions = [
    {
        name: 'Edit',
        icon: <Feather name='edit' size={20} color={colors.primary} />,
    },
    {
        name: 'Delete',
        icon: <Feather name='trash-2' size={20} color={colors.primary} />,
    },
]

const SingleProduct: FC<Props> = ({ route, navigation }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [busy, setBusy] = useState(false);
    const [productInfo, setProductInfo] = useState<Product>();
    const {authState} = useAuth();
    const { authClient } = useClient();
    const { product, id } = route.params;
    const dispatch = useDispatch();

    const isAdmin = authState.profile?.id === product?.seller.id;

    const confirmDelete = async () => {
        const id = product?.id;

        if (!id) return;

        setBusy(true);
        const res = await runAxiosAsync<{message: string}>(authClient.delete('/product/' + id));
        setBusy(false);
        if (res?.message) {
            dispatch(deleteItem(id));
            showMessage({message: res.message, type: 'success'});
            navigation.navigate('Listings');
        }
    };
    
    const onDeletePress = () => {
        Alert.alert(
            'Are you sure?', 
            'This action will remove this product permanently', 
            [
                {text: 'Delete', style: 'destructive', onPress: confirmDelete},
                {text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const fetchProductInfo = async (id: string) => {
        const res = await runAxiosAsync<{product: Product}>(authClient.get('/product/detail/'+ id));
        if (res) {
            setProductInfo(res.product);
        }
    };

    useEffect(() => {
        if (id) fetchProductInfo(id);
        
        if (product) setProductInfo(product);
    }, [id, product]);

    return (
        <>
            <AppHeader 
                backButton={<BackButton />}
                right={<OptionButton visible={isAdmin} onPress={() => setShowMenu(true)} />}
            />
            <View style={styles.container}>
                {productInfo ? <ProductDetail product={productInfo} /> : <></>}
                <Pressable onPress={() => navigation.navigate('ChatWindow')} style={styles.messageBtn}>
                    <AntDesign name='message1' size={20} color={colors.white} />
                </Pressable>
            </View>

            <OptionModal 
                options={menuOptions} 
                renderItem={({icon, name}) => (
                <View style={styles.option}>
                    {icon}
                    <Text style={styles.optionTitle}>{name}</Text>
                </View>
                )} 
                visible={showMenu} 
                onRequestClose={setShowMenu}
                onPress={(option) => {
                    if (option.name === 'Delete') {
                        onDeletePress()
                    }
                    if (option.name === 'Edit') {
                        navigation.navigate('EditProduct', {product: product!});
                    }
                }}
            />
            <LoadingSpinner visible={busy}/>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionTitle: {
        paddingLeft: 5,
        color: colors.primary
    },
    messageBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.active,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
    }
});

export default SingleProduct
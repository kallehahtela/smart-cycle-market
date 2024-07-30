import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React, { FC, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import ProductDetail from '@components/ProductDetail';
import useAuth from 'app/hooks/useAuth';
import colors from '@utils/colors';
import OptionButton from '@ui/OptionButton';
import OptionModal from '@components/OptionModal';
import { Feather } from '@expo/vector-icons';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { showMessage } from 'react-native-flash-message';
import LoadingSpinner from '@ui/LoadingSpinner';

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
    const {authState} = useAuth();
    const { authClient } = useClient();
    const { product } = route.params;


    const isAdmin = authState.profile?.id === product?.seller.id;

    const confirmDelete = async () => {
        const id = product?.id;

        if (!id) return;

        setBusy(true);
        const res = await runAxiosAsync<{message: string}>(authClient.delete('/product/' + id));
        setBusy(false);
        if (res?.message) {
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

    return (
        <>
            <AppHeader 
                backButton={<BackButton />}
                right={<OptionButton visible={isAdmin} onPress={() => setShowMenu(true)} />}
            />
            <View style={styles.container}>
                {product ? <ProductDetail product={product} /> : <></>}
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
});

export default SingleProduct
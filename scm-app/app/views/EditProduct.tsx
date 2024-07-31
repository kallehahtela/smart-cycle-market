import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import React, { FC, useState } from 'react'
import AppHeader from '@components/AppHeader'
import BackButton from '@ui/BackButton';
import size from '@utils/size';
import colors from '@utils/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import HorizontalImageList from '@components/HorizontalImageList';
import { FontAwesome5 } from '@expo/vector-icons';
import FormInput from '@ui/FormInput';
import DatePicker from '@ui/DatePicker';
import OptionsSelector from './OptionsSelector';
import OptionModal from '@components/OptionModal';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { string } from 'yup';
import { selectImages } from '@utils/helper';

type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'EditProduct'>

const imageOptions = [
    { value: 'Use as Thumbnail', id: 'thumb' },
    { value: 'Remove Image', id: 'remove' },
];

const EditProduct: FC<Props> = ({route}) => {
    const [selectedImage, setSelectedImage] = useState('');
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [product, setProduct] = useState({
        ...route.params.product,
        price: route.params.product.price.toString(),
        date: new Date(route.params.product.date),
    });
    const { authClient } = useClient();

    const onLongPress = (image: string) => {
        setSelectedImage(image);
        setShowImageOptions(true);
    }

    const removeSelectedImage = async () => {
        const notLocalImage = selectedImage.startsWith('https://res.cloudinary.com');

        if (notLocalImage) {
            const splittedItems = selectedImage.split('/');
            const imageId = splittedItems[splittedItems.length - 1].split('.')[0];
            await runAxiosAsync<{message: string}>(authClient.delete(`/product/image/${product.id}/${imageId}`));
        }
    };

    const handleOnImageSelect = async () => {
        const newImages = await selectImages();
        const oldImages = product.image || [];
        const images = oldImages.concat(newImages)
        setProduct({...product, image: [...images]})
    };

    return (
        <>
        <AppHeader backButton={<BackButton />} />
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Images</Text>
                <HorizontalImageList images={product.image || []} onLongPress={onLongPress} />
                <Pressable onPress={handleOnImageSelect} style={styles.imageSelector}>
                    <FontAwesome5 name='images' size={30} color={colors.primary} />
                </Pressable>

                <FormInput 
                    placeholder='Product name' 
                    value={product.name} 
                    onChangeText={(name) => setProduct({...product, name})} 
                />
                <FormInput 
                    placeholder='Price' 
                    keyboardType='numeric' 
                    value={product.price.toString()} 
                    onChangeText={(price) => setProduct({...product, price})} 
                />

                <DatePicker 
                    value={product.date} 
                    title='Purchasing Date; '
                    onChange={(date) => setProduct({...product, date})}
                />

                <OptionsSelector title={product.category || 'Category'} />

                <FormInput 
                    placeholder='Description' 
                    value={product.description}
                    onChangeText={(description) => setProduct({...product, description})} 
                />
            </ScrollView>
        </View>

        <OptionModal 
            options={imageOptions}
            visible={showImageOptions} 
            onRequestClose={setShowImageOptions}
            renderItem={(option) => {
                return <Text style={styles.option}>{option.value}</Text>
            }}
            onPress={({id}) => {
                if (id === 'thumb') {

                }
                
                if (id === 'remove') {
                    removeSelectedImage();
                }
            }}
        />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: size.padding,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
        color: colors.primary,
        marginBottom: 10,
    },
    imageSelector: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 7,
        borderColor: colors.primary,
        marginVertical: 10,
    },
    option: {
        paddingVertical: 10,
        color: colors.primary,
    }
});

export default EditProduct
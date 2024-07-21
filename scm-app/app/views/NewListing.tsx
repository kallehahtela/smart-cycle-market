import { View, StyleSheet, Pressable, Text, Platform } from 'react-native'
import React, { FC, useState } from 'react'
import FormInput from '@ui/FormInput';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from '@utils/colors';
import DatePicker from '@ui/DatePicker';
import OptionModal from '@components/OptionModal';
import categories from '@utils/categories';
import CategoryOption from '@ui/CategoryOption';
import { AntDesign } from '@expo/vector-icons';
import AppButton from '@ui/AppButton';
import CustomKeyAvoidingView from '@ui/CustomKeyAvoidingView';

interface Props {}

const NewListing: FC<Props> = (props) => {

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    return (
        <CustomKeyAvoidingView>
            <View style={styles.container}>
                <Pressable style={styles.fileSelector}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name='images' size={24} color='black'/>
                    </View>
                    <Text style={styles.btnTitle}>Add Images</Text>
                </Pressable>
                <FormInput placeholder='Product name'/>

                <FormInput placeholder='Price'/>

                <DatePicker title='Purchasing Date: ' value={new Date()} onChange={() => {}} />

                <Pressable style={styles.categorySelector} onPress={() => setShowCategoryModal(true)}>
                    <Text style={styles.categoryTitle}>Category</Text>
                    <AntDesign name='caretdown' color={colors.primary}/>
                </Pressable>

                <FormInput placeholder='Description'multiline numberOfLines={4}/>

                <AppButton active title='List Product'/>

                <OptionModal
                    visible={showCategoryModal} 
                    onRequestClose={setShowCategoryModal} 
                    options={categories}
                    renderItem={(item) => {
                        return (
                            <CategoryOption {...item}/>
                    );
                    }}  
                    onPress={(item) => {
                        console.log(item);
                    }}  
                />
            </View>
        </CustomKeyAvoidingView>
  )
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: Platform.OS === 'ios' ? 15 : 45,
        paddingHorizontal: 15,
        flex: 1,
    },
    btnTitle: {
        color: colors.primary,
        marginTop: 5,
    },
    fileSelector: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 7,
    },
    categorySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
        padding: 8,
        borderWidth: 1,
        borderColor: colors.deActive,
        borderRadius: 5,
    },
    categoryTitle: {
        color: colors.primary,
    },
});

export default NewListing;
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native'
import React, { FC, useState } from 'react'
import FormInput from '@ui/FormInput';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from '@utils/colors';
import DatePicker from '@ui/DatePicker';
import OptionModal from '@components/OptionModal';

interface Props {}

const NewListing: FC<Props> = (props) => {

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    return (
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

            <Pressable onPress={() => setShowCategoryModal(true)}>
                <Text>Category</Text>
            </Pressable>
            <FormInput placeholder='Description'/>
            <OptionModal visible={showCategoryModal} onRequestClose={setShowCategoryModal} />
        </View>
  )
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: Platform.OS === 'ios' ? 15 : 45,
        paddingHorizontal: 15,
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
});

export default NewListing;
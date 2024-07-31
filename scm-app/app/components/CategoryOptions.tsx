import { View, Text } from 'react-native'
import React, { FC, useState } from 'react'
import OptionsSelector from '@views/OptionsSelector'
import OptionModal from './OptionModal';
import categories from '@utils/categories';
import CategoryOption from '@ui/CategoryOption';

interface Props {
    title: string;
    onSelect(categoryName: string): void;
};

const CategoryOptions: FC<Props> = ({ title, onSelect }) => {

    const [showCategoryModal, setShowCategoryModal] = useState(false);


    return (
        <View>
            <OptionsSelector title={title} onPress={() => setShowCategoryModal(true)} />

            <OptionModal
                visible={showCategoryModal} 
                onRequestClose={setShowCategoryModal} 
                options={categories}
                renderItem={(item) => {
                    return (
                        <CategoryOption {...item} />
                    );
                }}
                onPress={(item) => onSelect(item.name)}
            />
        </View>
    );
};

export default CategoryOptions
import { View, StyleSheet, Image, Platform, Pressable } from 'react-native'
import { FC } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import colors from '@utils/colors';
import { useState } from 'react'

interface Props {
    uri?: string;
    size?: number;
    onPress?(): void;
}

const iconContainerFactor = .7
const iconSizeFactor = .8

const AvatarView: FC<Props> = ({ size = 50, uri, onPress }) => {
    const [imageError, setImageError] = useState(false);
    const iconContainerSize = size * iconContainerFactor
    const iconSize = size * iconSizeFactor

    return (
        <Pressable
            onPress={onPress} 
            style={[
                { width: size, height: size, borderRadius: size / 2 },
                styles.container,
                (!uri || imageError) && styles.profileIcon,
            ]}
        >
            {uri && !imageError ? (
                <Image 
                    source={{ uri }} 
                    style={styles.flex1} 
                    onError={(e) => {
                        console.log('Image Load Error:', e.nativeEvent.error);
                        setImageError(true);
                    }} 
                />
            ): (
                <View style={[
                    { 
                        width: iconContainerSize, 
                        height: iconContainerSize, 
                        borderRadius: iconContainerSize / 2,
                    },
                    styles.iconContainer]}>
                    <FontAwesome name='user' size={iconSize} color={colors.white} />
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Platform.OS === 'android' ? 30 : 0,
        overflow: 'hidden',
    },
    flex1: {
        flex: 1,
    },
    profileIcon: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

export default AvatarView;
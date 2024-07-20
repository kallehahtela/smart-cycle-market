import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import React, { FC, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '@utils/colors';

interface Props {
    title: string;
    value: Date;
    onChange(value: Date): void;
}

const isIOS = Platform.OS === 'ios';

const DatePicker: FC<Props> = ({ title, value, onChange }) => {
    const [showPicker, setShowPicker] = useState(false); 
    const visible = isIOS ? true : showPicker;

    const handleOnPress = () => {
        if (isIOS) return;
        setShowPicker(true);
    }

    return (
        <Pressable onPress={handleOnPress} style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {!isIOS && <Text style={styles.value}>{value.toISOString()}</Text>}
           {visible ?  (
            <DateTimePicker 
                testID='dateTimePicker' 
                value={value}
                onChange={(_, date) => {
                    if (date) {
                        onChange(date);
                    }
                }}
            />
            ) : null }
        </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    title: {
        color: colors.primary,
    },
    value: {
        color: colors.primary,
        paddingLeft: 15,
    }
});

export default DatePicker
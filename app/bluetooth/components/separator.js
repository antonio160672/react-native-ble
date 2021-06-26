import React from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
function Divice(props) {
    return (
            <View
                style={[styles.separador,
                {
                    borderColor:props.color? props.color:'#eceff1'
                }]}
            />

    )
}
const styles = StyleSheet.create({
    separador: {
        flex:1,
        borderTopWidth:1,
        marginLeft:60,
        marginRight:25
    },
    
})
export default Divice;
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    caixa: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    divisor: {
        borderBottomWidth: 2,
        borderBottomColor: '#C7C7C7',
        marginBottom: 20,
        marginTop: 20
    },

    empresa: {
        color: '#345D7E',
        fontSize: 18,
        fontWeight: 'bold',
    },

    area: {
        color: '#C06C84',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right'
    },

    atividades: {
        color: '#555555',
        fontSize: 16,
        marginRight: 8,
        paddingTop: 5
    }
})
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const AppStyle = {
    Screen: {
        FullWidth: width,
        FullHeight: height,
    },
    Color: {
        Black1: '#000000',
        Black2: '#1d1d1d',
        White: '#FFFFFF',
        Orange: '#F68A1D',
        OrangeSub: '#FFBC25',
        Green: '#169D56',
        Dark: '#191E28',
        DarkBlue: '#333D50',
        TabBarGray: '#CCCCCC',
        TextGray: '#9695A8',
        LightGray: '#F4F4F4',
        Background: '#FFFFFF',
        Secondary: '#333E63',
        Main: '#47A7FF',
        MainBlur: '#47A7FF25'
    },
    Text: {
        Large: 18,
        Medium: 15,
        Normal: 13,
        Small: 11,
        Min: 9,
        IpadNormal: 22,
        IpadMedium: 30
    }
}

export default AppStyle;
import 'react-native';

declare module 'react-native' {
  interface TouchableOpacityProps {
    onMouseEnter?: (event: any) => void;
    onMouseLeave?: (event: any) => void;
  }
}

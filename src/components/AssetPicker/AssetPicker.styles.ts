import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  wrap: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  shroud: {
    flex: 1,
    width: '100%',
  },
  inner: {
    flex: 1,
  },
  flatListWrap: {
    flex: 1,
  },
  item: {
    aspectRatio: 1,
    flex: 1,
  },
  multiButtonWrap: {
    flexShrink: 0,
  },
});

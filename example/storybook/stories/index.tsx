/* eslint-disable react-native/no-inline-styles */
import React, { FC } from 'react';
import { storiesOf } from '@storybook/react-native';
import { Button, View, Image, Text } from 'react-native';
import AssetPicker, { AssetPickerItemProps, ListFooterComponentProps, MultiSelectComponentProps } from 'mbp-components-rn-assetpicker';


/**
 * Create an AssetPickerItem component and pass it to the Provider
 */
const AssetPickerItem: FC<AssetPickerItemProps> = (props) => (
  <View style={{ padding: 2 }}>
    <Image
      style={{ width: '100%', height: '100%' }}
      source={{ uri: props.asset.node.image.uri }}
      resizeMode='cover'
    />
  </View>
);


/**
 * Create an ListFooterComponent and pass it to the Provider
 */
const ListFooterComponent: FC<ListFooterComponentProps> = (props) => {
  if (props.noMoreAssets) {
    return <Text>No More Images</Text>;
  }

  return <Text>Loading</Text>;
};


/**
 * Create an MultiSelectComponent and pass it to the Provider
 */
const MultiSelectComponent: FC<MultiSelectComponentProps> = (props) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 100 }}>
    <Text>Selected: {props.selectedAssets.length}</Text>
    <Button
      title='Add Selected'
      onPress={props.onDoneMultiSelect}
      disabled={!props.selectedAssets.length}
    />
  </View>
);


storiesOf('Story', module)
  .add('AssetPicker - single', () => (
    <AssetPicker
      assetType="Photos"
      onSelectAssets={console.log}
      onDismiss={console.log}
      config={{
        AssetPickerItem,
        ListFooterComponent,
        MultiSelectComponent,
        numColumns: 2,
        shroudStyles: { backgroundColor: 'black' },
      }}
    />
  ))
  .add('AssetPicker - multi', () => (
    <AssetPicker
      assetType="Photos"
      onSelectAssets={console.log}
      onDismiss={console.log}
      isMulti
      config={{
        AssetPickerItem,
        ListFooterComponent,
        MultiSelectComponent,
        numColumns: 2,
        shroudStyles: { backgroundColor: 'black' },
      }}
    />
  ));

/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Button, View, Image, Text } from 'react-native';
import { useAssetPicker, AssetPickerProvider, AssetPickerItemProps, ListFooterComponentProps, MultiSelectComponentProps } from 'mbp-components-rn-assetpicker';
import CenterView from '../components/CenterView/CenterView';


const TestComponent = (props: {isMulti?: boolean}) => {
  const assetPicker = useAssetPicker();

  return (
    <Button
      title={assetPicker.open ? 'CLOSE' : 'OPEN'}
      onPress={() => {
        /**
         * Open the picker and set type and onSelectAsset callback
         */
        assetPicker.updateProps({
          assetType: 'All',
          open: !assetPicker.open,
          isMulti: props.isMulti,
          onSelectAssets: (assets) => {
            // eslint-disable-next-line no-console
            console.log('TestComponent -> assets', assets);
            /**
             * Do something with assets
             * Close picker
             */
            assetPicker.updateProps({
              open: false,
            });
          },
        });
      }}
    />
  );
};


/**
 * Create an AssetPickerItem component and pass it to the Provider
 */
const AssetPickerItem = (props: AssetPickerItemProps) => (
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
const ListFooterComponent = (props: ListFooterComponentProps) => {
  if (props.noMoreAssets) {
    return <Text>No More Images</Text>;
  }

  return <Text>Loading</Text>;
};


/**
 * Create an MultiSelectComponent and pass it to the Provider
 */
const MultiSelectComponent = (props: MultiSelectComponentProps) => (
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
  .addDecorator((getStory) => (
    <AssetPickerProvider
      config={{
        numColumns: 1,
        AssetPickerItem,
        ListFooterComponent,
        MultiSelectComponent,
      }}
    >
      {getStory()}
    </AssetPickerProvider>
  ))
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add('AssetPicker - single', () => (
    <TestComponent />
  ))
  .add('AssetPicker - multi', () => (
    <TestComponent isMulti />
  ));

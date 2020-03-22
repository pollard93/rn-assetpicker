import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { TouchableOpacity, Text, View } from 'react-native';
import AssetPickerProvider from './AssetPickerProvider';
import { AssetPickerInner } from '../AssetPicker/AssetPicker';
import { AssetPickerItemProps, MultiSelectComponentProps, ListFooterComponentProps } from '../AssetPickerContext/AssetPickerContext';

const testNode = {
  timestamp: 1522437259.365,
  group_name: 'All Photos',
  type: 'image',
  location: {
    speed: 0.5513811087502415,
    latitude: 37.76007833333333,
    longitude: -122.50956666666667,
    heading: 0,
    altitude: 4.583391486392184,
  },
  image: {
    filename: '',
    playableDuration: 0,
    isStored: true,
    width: 4032,
    uri: 'ph://CC95F08C-88C3-4012-9D6D-64A413D254B3/L0/001',
    height: 3024,
  },
};

beforeEach(() => {
  jest.useFakeTimers();
});

describe('<AssetPickerProvider />', () => {
  it('Tests render open and close', async () => {
    /* eslint-disable */
    const config = {
      AssetPickerItem: (props: AssetPickerItemProps) => <View></View>,
      ListFooterComponent: (props: ListFooterComponentProps) => <View></View>,
      MultiSelectComponent: (props: MultiSelectComponentProps) => <View></View>,
    };
    /* eslint-enable */

    const assetPickerItemSpy = sinon.spy(config, 'AssetPickerItem');
    const listFooterComponentSpy = sinon.spy(config, 'ListFooterComponent');
    const multiSelectComponentSpy = sinon.spy(config, 'MultiSelectComponent');

    const wrapper = mount(
      <AssetPickerProvider
        config={config}
      >
        <Text>CHILD</Text>
      </AssetPickerProvider>,
    );

    // Test render
    expect(wrapper.contains('CHILD')).to.be.true;
    expect(wrapper.find(AssetPickerInner)).to.be.empty;
    expect(wrapper.find(AssetPickerInner).props().open).to.be.false;

    // Open asset picker
    wrapper.find(AssetPickerInner).props().updateProps({
      open: true,
    });
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find(AssetPickerInner).props().open).to.be.true;

    // Test there is items
    wrapper.find('FlatList').update();
    expect(wrapper.findWhere((n) => n.props().testID === 'ASSETPICKERITEM')).to.have.length;

    // Close by touching shroud
    wrapper.find(TouchableOpacity).first().props().onPress({} as any);
    jest.runAllTimers();
    wrapper.find(AssetPickerInner).update();
    expect(wrapper.find(AssetPickerInner)).to.be.empty;
    expect(wrapper.find(AssetPickerInner).props().open).to.be.false;

    // Test components received the correct arguments
    expect(assetPickerItemSpy.args[0][0].asset).to.exist;
    expect(assetPickerItemSpy.args[0][0].isSelected).to.be.false;
    expect(listFooterComponentSpy.args[0][0].noMoreAssets).to.be.false;
    expect(multiSelectComponentSpy.callCount).to.equal(0);
  });

  it('Tests single select', async () => {
    /* eslint-disable */
    const config = {
      AssetPickerItem: (props: AssetPickerItemProps) => <View></View>,
      ListFooterComponent: (props: ListFooterComponentProps) => <View></View>,
      MultiSelectComponent: (props: MultiSelectComponentProps) => <View></View>,
    };
    /* eslint-enable */

    const onSelectAssetsSpy = sinon.spy();

    const wrapper = mount(
      <AssetPickerProvider
        config={config}
      >
        <Text>CHILD</Text>
      </AssetPickerProvider>,
    );

    // Open asset picker
    wrapper.find(AssetPickerInner).props().updateProps({
      open: true,
      onSelectAssets: onSelectAssetsSpy,
    });
    jest.runAllTimers();
    wrapper.update();

    // Select first item
    wrapper.findWhere((n) => n.props().testID === 'ASSETPICKERITEM').first().props().onPress();

    // Check spy has been called and has node in args
    expect(onSelectAssetsSpy.args[0][0]).to.have.lengthOf(1);
    expect(onSelectAssetsSpy.args[0][0][0]).to.deep.equal(testNode);
  });

  it('Tests multi select render', async () => {
    /* eslint-disable */
    const config = {
      AssetPickerItem: (props: AssetPickerItemProps) => <View></View>,
      ListFooterComponent: (props: ListFooterComponentProps) => <View></View>,
      MultiSelectComponent: (props: MultiSelectComponentProps) => <View></View>,
    };
    /* eslint-enable */

    const onSelectAssetsSpy = sinon.spy();
    const assetPickerItemSpy = sinon.spy(config, 'AssetPickerItem');
    const multiSelectComponentSpy = sinon.spy(config, 'MultiSelectComponent');

    const wrapper = mount(
      <AssetPickerProvider
        config={config}
      >
        <Text>CHILD</Text>
      </AssetPickerProvider>,
    );

    // Open asset picker
    wrapper.find(AssetPickerInner).props().updateProps({
      ...wrapper.find(AssetPickerInner).props(),
      open: true,
      isMulti: true,
      onSelectAssets: onSelectAssetsSpy,
    });
    jest.runAllTimers();
    wrapper.update();

    // Select first item, check is selected state before and after
    expect(assetPickerItemSpy.args[assetPickerItemSpy.args.length - 1][0].isSelected).to.be.false;
    wrapper.findWhere((n) => n.props().testID === 'ASSETPICKERITEM').first().props().onPress();
    wrapper.update();
    expect(assetPickerItemSpy.args[assetPickerItemSpy.args.length - 1][0].isSelected).to.be.true;

    // Check onSelectAssetsSpy has not been called yet
    expect(onSelectAssetsSpy.callCount).to.equal(0);

    // Test the last multi select args
    expect(multiSelectComponentSpy.args[multiSelectComponentSpy.args.length - 1][0].selectedAssets).to.have.lengthOf(1);

    // Call on done
    multiSelectComponentSpy.args[multiSelectComponentSpy.args.length - 1][0].onDoneMultiSelect();

    // Check spy has been called and has node in args
    expect(onSelectAssetsSpy.args[0][0]).to.have.lengthOf(1);
    expect(onSelectAssetsSpy.args[0][0][0]).to.deep.equal(testNode);
  });
});

import React, { useMemo, useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, Platform, Dimensions, View } from 'react-native';
import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll';
import styles from './AssetPicker.styles';
import { useAssetPicker, AssetPickerContextProps } from '../AssetPickerContext/AssetPickerContext';

const { height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.5;


/**
 * AssetPicker component listens for changes in the AssetPickerContext and renders AssetPickerInner
 */
const AssetPicker = () => {
  const assetPickerContext = useAssetPicker();

  // Wrap AssetPickerInner so it only updates when the context changes
  return useMemo(() => (
    <AssetPickerInner {...assetPickerContext} />
  ), [assetPickerContext]);
};


/**
 * Handles the loading and displaying of assets
 */
export const AssetPickerInner = (props: AssetPickerContextProps) => {
  if (!props.open) return null;


  /**
   * Pagination state
   */
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [lastCursor, setLastCursor] = useState<string>(undefined);
  const [assets, setAssets] = useState<PhotoIdentifier[]>([]);
  const [noMoreAssets, setNoMoreAssets] = useState(false);


  /**
   * Selection state
   */
  const [selectedAssets, setSelectedAssets] = useState<PhotoIdentifier[]>([]);


  /**
   * Loads assets and appends results to state
   */
  const loadAssets = async () => {
    // Only allow this fucntion to run sequentially
    if (loadingAssets) return;
    setLoadingAssets(true);

    try {
      const data = await CameraRoll.getPhotos({
        first: 4,
        after: lastCursor,
        assetType: props.assetType,
        groupTypes: Platform.OS !== 'android' ? 'All' : undefined,
      });

      setAssets([...assets, ...data.edges]);
      setLastCursor(data.page_info.end_cursor);
      setNoMoreAssets(!data.page_info.has_next_page);
      // eslint-disable-next-line no-empty
    } catch (e) {}

    setLoadingAssets(false);
  };


  /**
   * When user reaches the end of the flat list, loadAssets if possible
   */
  const onEndReached = () => {
    if (noMoreAssets || loadingAssets) return;
    loadAssets();
  };


  /**
   * On select asset, handles multi and non multi
   * @param asset
   */
  const onSelectAsset = (asset: PhotoIdentifier) => {
    if (props.isMulti) {
      // Set and remove selected
      if (selectedAssets.includes(asset)) {
        setSelectedAssets(selectedAssets.filter((a) => a !== asset));
      } else {
        setSelectedAssets([...selectedAssets, asset]);
      }
    } else {
      // Single select, can execute onSelectAssets with single asset
      props.onSelectAssets([asset.node]);
    }
  };


  /**
   * Multi select done action
   */
  const onDoneMultiSelect = () => {
    props.onSelectAssets(selectedAssets.map((a) => a.node));
  };


  /**
   * Load assets on mount
   */
  useEffect(() => {
    loadAssets();
  }, []);


  return (
    <TouchableOpacity
      style={styles.wrap}
      onPress={() => {
        /**
         * Close picker when pressing the background
         */
        props.updateProps({
          open: false,
        });
      }}
    >
      <View style={styles.inner}>
        <View style={styles.flatListWrap}>
          <FlatList
            data={assets}
            onEndReached={onEndReached}
            numColumns={2}
            contentContainerStyle={[{ paddingTop: HEADER_MAX_HEIGHT }]}
            keyExtractor={(item) => item.node.image.uri}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelectAsset(item)}
                style={styles.item}
                testID='ASSETPICKERITEM'
              >
                <View style={styles.itemInner}>
                  {props.config.AssetPickerItem({
                    asset: item,
                    isSelected: selectedAssets.includes(item),
                  })}
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={props.config.ListFooterComponent({ noMoreAssets })}
          />
        </View>

        {(props.isMulti ? (
          <View style={styles.multiButtonWrap}>
            {props.config.MultiSelectComponent({
              selectedAssets,
              onDoneMultiSelect,
            })}
          </View>
        ) : null)}
      </View>
    </TouchableOpacity>
  );
};

export default AssetPicker;

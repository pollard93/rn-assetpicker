import React, { useMemo, useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, Platform, Dimensions, View, Animated } from 'react-native';
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


  /**
   * Animation state
   */
  const [opacity] = useState(new Animated.Value(0));
  const [closed, setClosed] = useState(true);


  /**
   * Handle in and out animation when props.open changes
   */
  useEffect(() => {
    if (!props.open && closed) return;

    /**
     * If changed to open, set closed to false to render
     */
    if (props.open) {
      setClosed(false);
    }

    /**
     * Animate the opacity value in or out, dependant on props.open
     */
    Animated.timing(opacity, {
      toValue: props.open ? 1 : 0,
      duration: 300,
    }).start(() => {
      /**
       * If animated out, set closed to true to not render
       */
      if (!props.open) {
        setClosed(true);
        setSelectedAssets([]);
      }
    });
  }, [props.open]);


  /**
   * Do not render if closed
   */
  if (closed) return null;


  return (
    <Animated.View style={[styles.wrap, props.config.shroudStyles, { opacity }]}>
      <TouchableOpacity
        style={styles.shroud}
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
              numColumns={props.config.numColumns || 2}
              contentContainerStyle={[{ paddingTop: HEADER_MAX_HEIGHT }]}
              keyExtractor={(item) => item.node.image.uri}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelectAsset(item)}
                  style={styles.item}
                  testID='ASSETPICKERITEM'
                >
                  {props.config.AssetPickerItem({
                    asset: item,
                    isSelected: selectedAssets.includes(item),
                  })}
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
    </Animated.View>
  );
};

export default AssetPicker;

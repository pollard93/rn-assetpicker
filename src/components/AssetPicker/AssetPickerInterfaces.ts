import { FC } from 'react';
import { ViewStyle } from 'react-native';
import { PhotoIdentifier, AssetType } from '@react-native-community/cameraroll';


export interface AssetPickerItemProps {
  asset: PhotoIdentifier;
  isSelected: boolean;
}


export interface ListFooterComponentProps {
  noMoreAssets: boolean;
}


export interface MultiSelectComponentProps {
  selectedAssets: PhotoIdentifier[];
  onDoneMultiSelect: () => void;
}


export interface AssetPickerConfig {
  AssetPickerItem: FC<AssetPickerItemProps>;
  ListFooterComponent: FC<ListFooterComponentProps>;
  MultiSelectComponent: FC<MultiSelectComponentProps>;
  numColumns?: number; // Default 2
  shroudStyles?: ViewStyle;
}


export interface AssetPickerProps {
  config: AssetPickerConfig;
  assetType: AssetType;
  onSelectAssets: (assets: PhotoIdentifier['node'][]) => void;
  onDismiss: () => void;
  isMulti?: boolean;
}

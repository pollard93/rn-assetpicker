import React, { createContext, useContext, ReactElement } from 'react';
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
  AssetPickerItem: (props: AssetPickerItemProps) => ReactElement;
  ListFooterComponent: (props: ListFooterComponentProps) => ReactElement;
  MultiSelectComponent: (props: MultiSelectComponentProps) => ReactElement;
}


export interface AssetPickerContextProps {
  assetType: AssetType;
  open: boolean;
  onSelectAssets: (assets: PhotoIdentifier['node'][]) => void;
  isMulti: boolean;
  updateProps: React.Dispatch<Partial<AssetPickerContextProps>>;
  config?: AssetPickerConfig;
}


export const AssetPickerContext = createContext<AssetPickerContextProps>(null);

export const useAssetPicker = () => useContext(AssetPickerContext);

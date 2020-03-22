import React, { useReducer, ReactNode } from 'react';
import AssetPicker from '../AssetPicker/AssetPicker';
import { AssetPickerContext, AssetPickerContextProps, AssetPickerConfig } from '../AssetPickerContext/AssetPickerContext';


export interface AssetPickerProviderProps {
  config: AssetPickerConfig;
  children?: ReactNode;
}


const AssetPickerProvider = (providerProps: AssetPickerProviderProps) => {
  /**
   * Reducer to merge prev and new props
   * Used to update the provider's props
   * Passing open:true will open the picker etc
   */
  const reducer = (prevProps: AssetPickerContextProps, props: Partial<AssetPickerContextProps>) => ({
    ...prevProps,
    ...props,
  });


  /**
   * Set default props
   */
  const [props, updateProps] = useReducer(reducer, {
    config: providerProps.config,
    assetType: null,
    open: false,
    onSelectAssets: null,
    isMulti: null,
    updateProps: null,
  });


  /**
   * Create provider with the props, and also the ability to update the props
   */
  return (
    <AssetPickerContext.Provider
      value={{
        ...props,
        updateProps,
      }}
    >
      {providerProps.children}
      <AssetPicker />
    </AssetPickerContext.Provider>
  );
};

export default AssetPickerProvider;


import React from 'react';
import { storiesOf } from '@storybook/react-native';
import Hello from 'mbp-components-rn-assetpicker';
import CenterView from '../components/CenterView/CenterView';

storiesOf('Hello', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add('Hello', () => (
    <Hello content="Hello" />
  ));

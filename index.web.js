/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {
  AppRegistry,
} from 'react-native';

import 'whatwg-fetch'; // enable fetch
import './js/libs/gapi';

import ClientApp from './js/components/ClientApp';

AppRegistry.registerComponent('UniversalNativeBoilerplate', () => ClientApp);

AppRegistry.runApplication('UniversalNativeBoilerplate', {
  rootTag: document.getElementById('container'),
});

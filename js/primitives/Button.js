import React, { PropTypes } from 'react';
import {
  TouchableHighlight,
} from 'react-native';
import styled from 'styled-components/primitives';

import Link from '../components/Link';
import Icon from '../components/Icon';

import { getColor, getContrast } from './helpers';

import theme from './theme.json';


const StyledView = styled.View`
  flex: 1;
  backgroundColor: ${props => getColor(props, false)};
  border: 4px solid ${props => (props.inverted ? getContrast(false) : getContrast(true))};
  borderRadius: ${2 * theme.unit}px;
  min-height: ${3 * theme.unit}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 ${0.5 * theme.unit}px;
`;

const StyledText = styled.Text`
  color: ${props => getColor(props, true)};
  font-family: ${theme.font};
  font-weight: 600;
  font-size: 18px;
`;

const Button = ({
  style,
  containerStyle,
  icon,
  secondary,
  children,
  ...props
}, context) => {
  const passProps = {
    inverted: context.inverted,
    secondary,
  };
  const outerContainer = props.href ? Link : TouchableHighlight;
  return React.createElement(outerContainer, {
    containerStyle: [{ flexGrow: 1, flexShrink: 1, height: 3 * theme.unit }, containerStyle],
    ...props,
  }, (
    <StyledView
      style={style}
      {...passProps}
    >
      {
        icon &&
        <Icon
          name={icon}
          color={getColor(passProps, true)}
          style={{ marginRight: children ? theme.unit / 2 : 0 }}
        />
      }
      <StyledText {...passProps}>
        {children || null}
      </StyledText>
    </StyledView>
  ));
};

Button.propTypes = {
  href: PropTypes.string,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  icon: PropTypes.string,
  secondary: PropTypes.bool,
  children: PropTypes.any,
};

Button.contextTypes = {
  inverted: PropTypes.bool,
};

export default Button;

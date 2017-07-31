import React, { PropTypes } from 'react';
import styled from 'styled-components/primitives';
import theme from './theme.json';

const StyledHeader = styled.Text`
  color: ${props => (props.inverted ? theme.textInverted : theme.text)};
  font-size: 28px;
  margin-bottom: ${theme.pad};
  font-family: ${theme.font};
  font-weight: ${theme.weight};
`;

const Header = (props, context) => (
  <StyledHeader
    inverted={context.inverted}
    {...props}
  />
);

Header.contextTypes = {
  inverted: PropTypes.bool,
};

export default Header;

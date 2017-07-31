import React, { PropTypes } from 'react'; 
import styled from 'styled-components/primitives';
import theme from './theme.json';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  margin: ${theme.pad} 0;
  min-height: 45px;
`;

const UIContainer = ({ ...props }) => {
  return (
    <Container style={props.containerStyle}>
      {props.children || null}
    </Container>
  );
};

UIContainer.propTypes = {
  children: PropTypes.any,
  containerStyle: PropTypes.object,
};

export default UIContainer;

import React, {
  PropTypes,
} from 'react';
import styled from 'styled-components/primitives';

import Webcam from './components/Webcam';

const Container = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;
  backgroundColor: #F5FCFF;
`;

const Home = () => {
  return (
    <Container>
      <Webcam />
    </Container>
  );
};

Home.contextTypes = {
  store: PropTypes.object,
};

export default Home;

import React, {
  PropTypes,
} from 'react';
import styled from 'styled-components/primitives';

import Webcam from './components/Webcam';
import Cards from './components/Cards';

import Header from '../../primitives/Header';

const Container = styled.View`
  backgroundColor: #F5FCFF;
  padding: 20px;
`;

const Home = () => {
  return (
    <Container>
      <Header>Business Card Scanner</Header>
      <Webcam />
      <Cards />
    </Container>
  );
};

Home.contextTypes = {
  store: PropTypes.object,
};

export default Home;

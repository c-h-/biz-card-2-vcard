import React, {
  PropTypes,
  PureComponent,
} from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components/primitives';

const Container = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;
  backgroundColor: #F5FCFF;
`;

const Text = styled.Text`
  font-size: 16px;
`;

const Button = styled.Touchable`
  padding: 10px;
  border: 2px solid blue;
  margin: 10px;
  font-size: 20px;
  color: blue;
`;

class Home extends PureComponent {
  state = {
    streamStatus: false,
  }
  receiveStream = () => this.setState({ streamStatus: true })
  captureStream = () => {
    // capture stream as base64
    const imageSrc = this.webcam.getScreenshot();
    console.log(imageSrc);
  }
  render() {
    const {
      streamStatus,
    } = this.state;
    return (
      <Container>
        <Text>
        {
          streamStatus
          ? 'Capture a business card image to begin analysis'
          : 'Please accept camera permissions.'
        }
        </Text>
        <Webcam
          height={480}
          width={640}
          screenshotFormat="image/jpeg"
          ref={ref => (this.webcam = ref)}
          audio={false}
          onUserMedia={this.receiveStream}
        />
        {
          streamStatus &&
          <Button
            onPress={this.captureStream}
          >
            <Text>Capture</Text>
          </Button>
        }
      </Container>
    );
  }
}

Home.contextTypes = {
  store: PropTypes.object,
};

export default Home;

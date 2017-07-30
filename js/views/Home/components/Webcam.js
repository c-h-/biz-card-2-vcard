import React, {
  PureComponent,
} from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components/primitives';
import { View } from 'react-native';

import ocr from '../../../libs/ocr';
import { analyze } from '../../../libs/gapi_entity';

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

const states = {
  NEED_PERMISSION: 0,
  READY: 1,
  SELECT_STREAM: 2,
  PROCESSING: 3, // reshaping image
  UPLOADING: 4, // Uploading to OCR Space
  ANALYZING: 5, // G API Analysis
  ERROR: 6,
};

class WebcamContainer extends PureComponent {
  state = {
    status: states.NEED_PERMISSION,
    devices: [],
    audioDevices: [],
    selectedDevice: null,
    errMsg: null,
  }
  componentWillMount() {
    if (typeof navigator !== 'undefined') {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const videoSources = devices.filter(device => device.kind === 'videoinput');
          this.setState({
            status: videoSources.length > 1
              ? states.SELECT_STREAM
              : states.READY,
            devices: videoSources,
            audioDevices: devices.filter(device => device.kind === 'audioinput'),
          });
        });
    }
  }
  receiveStream = () => this.setState({ status: states.READY })
  analyzeText = ({ ...args }) => {
    // analyze OCR text
    analyze(...args)
      .then(() => {
        this.setState({
          status: states.READY,
        });
      })
      .catch((err) => {
        this.setState({
          status: states.ERROR,
          errMsg: 'Analysis error.',
        });
      });
  }
  captureStream = () => {
    // capture stream as base64 and perform OCR on it
    const base64Image = this.webcam.getScreenshot();
    this.setState({
      status: states.UPLOADING,
    }, () => {
      // call ocr after completing state change
      ocr(base64Image)
        .then((results) => {
          if (results) {
            if (results.IsErroredOnProcessing) {
              this.setState({
                status: states.ERROR,
                errMsg: results.ErrorMessage ? results.ErrorMessage[0] : 'OCR error.',
              });
            }
            else {
              this.setState({
                status: states.ANALYZING,
              }, this.analyzeText);
            }
          }
          else {
            this.setState({
              status: states.ERROR,
              errMsg: 'OCR error.',
            });
          }
        })
        .catch((error) => {
          let errMsg = 'OCR error.';
          if (
            error
            && error.response
            && error.response.ErrorMessage
            && error.response.ErrorMessage[0]
          ) {
            errMsg = error.response.ErrorMessage[0];
          }
          this.setState({
            status: states.ERROR,
            errMsg,
          });
        });
    });
  }
  selectStream = (deviceId) => {
    return () => {
      this.setState({
        selectedDevice: deviceId,
        status: states.READY,
      });
    };
  }
  render() {
    const {
      audioDevices,
      devices,
      status,
      selectedDevice,
      errMsg,
    } = this.state;
    let statusMsg;
    switch (status) {
      case states.UPLOADING: {
        statusMsg = 'Uploading...';
        break;
      }
      case states.NEED_PERMISSION: {
        statusMsg = 'Please accept camera permissions.';
        break;
      }
      case states.SELECT_STREAM: {
        statusMsg = 'Please select a camera source.';
        break;
      }
      case states.ERROR: {
        statusMsg = errMsg || 'General error.';
        break;
      }
      case states.ANALYZING: {
        statusMsg = 'Analyzing text...';
        break;
      }
      case states.READY:
      default: {
        statusMsg = 'Capture a business card image to begin analysis';
      }
    }
    const webcamOptions = {};
    if (selectedDevice) {
      webcamOptions.videoSource = selectedDevice;
      webcamOptions.audioSource = audioDevices[0] || '';
    }
    return (
      <View>
        <Text>{statusMsg}</Text>
        {
          status === states.READY
          && devices
          && devices.length === 0
          && <Text>Error: No Camera found</Text>
        }
        {
          status === states.ERROR
          && <Button onPress={() => document.location.reload()}><Text>Reload and Reset</Text></Button>
        }
        {
          status === states.READY &&
          <View>
            <Webcam
              height={480}
              width={640}
              screenshotFormat="image/jpeg"
              ref={ref => (this.webcam = ref)}
              audio={false}
              onUserMedia={this.receiveStream}
              {...webcamOptions}
            />
            <Button
              onPress={this.captureStream}
            >
              <Text>Capture</Text>
            </Button>
          </View>
        }
        {
          status === states.SELECT_STREAM &&
          <View>
            {
              devices.map((device, i) => {
                return (
                  <Button
                    onPress={this.selectStream(device.deviceId)}
                    key={device.deviceId}
                  >
                    <Text>{`Video Input ${i}`}</Text>
                  </Button>
                );
              })
            }
          </View>
        }
      </View>
    );
  }
}

export default WebcamContainer;

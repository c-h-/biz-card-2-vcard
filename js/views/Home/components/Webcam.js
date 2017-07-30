import React, {
  PropTypes,
  PureComponent,
} from 'react';
import Webcam from 'react-webcam';
import { View } from 'react-native';
import { connect } from 'react-redux';

import ocr from '../../../libs/ocr';
import { analyze } from '../../../libs/gapi_entity';
import { saveCard } from '../actions';

import Text from '../../../primitives/Text';
import Button from '../../../primitives/Button';

const states = {
  NEED_PERMISSION: 0,
  READY: 1,
  SELECT_STREAM: 2,
  PROCESSING: 3, // reshaping image
  UPLOADING: 4,  // Uploading to OCR Space
  ANALYZING: 5,  // G API Analysis
  ERROR: 6,
};

class WebcamContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
  }
  state = {
    status: states.NEED_PERMISSION,
    devices: [],
    audioDevices: [],
    selectedDevice: null,
    errMsg: null,
    meta: {},
  }
  componentWillMount() {
    if (typeof navigator !== 'undefined') {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          console.log('Found devices', devices);
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
  analyzeText = (OCRResults) => {
    // analyze OCR text
    analyze(OCRResults)
      .then((entities) => {
        console.log('Got stuff', entities);
        this.props.dispatch(saveCard({
          ...this.state.meta,
          entities,
        }));
        this.setState({
          status: states.READY,
        });
      })
      .catch((err) => {
        this.setState({
          status: states.ERROR,
          errMsg: typeof err === 'string' ? err : 'Analysis error.',
        });
      });
  }
  captureStream = () => {
    // capture stream as base64 and perform OCR on it
    const base64Image = this.webcam.getScreenshot();
    this.setState({
      status: states.UPLOADING,
      meta: { // reset meta
        base64Image,
      },
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
                meta: {
                  ...this.state.meta,
                  ocrResults: results,
                },
              }, () => {
                this.analyzeText(results);
              });
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
                    <Text>
                      {
                        device.label.length
                        ? device.label
                        : `Video Input ${i + 1}`
                      }
                    </Text>
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

export default connect(() => ({}))(WebcamContainer);

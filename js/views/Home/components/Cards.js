import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Text from '../../../primitives/Text';

class Cards extends PureComponent {
  render() {
    return (
      <Text>Cards</Text>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Cards);
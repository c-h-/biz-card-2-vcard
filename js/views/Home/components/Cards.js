import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/primitives';

import Card from '../../../primitives/Card';

const CardsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
`;

class Cards extends Component {
  static propTypes = {
    cards: PropTypes.array,
  }
  render() {
    const {
      cards,
    } = this.props;
    return (
      <CardsContainer>
        {
          cards.map((card, i) => {
            console.log('CARD', card);
            return (
              <Card key={card.id || i} card={card} />
            );
          })
        }
      </CardsContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    cards: state.home.cards,
  };
}

export default connect(mapStateToProps)(Cards);

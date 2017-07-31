import React, { Component, PropTypes } from 'react';
import styled from 'styled-components/primitives';
import { Image, View } from 'react-native';
import vCard from 'vcards-js';
import download from 'downloadjs';
import { connect } from 'react-redux';

import theme from './theme.json';

import Text from './Text';
import Toolbar from './Toolbar';
import Button from './Button';

import { removeCard } from '../views/Home/actions';

const StyledView = styled.View`
  border: 1px solid #FEE;
  padding: ${theme.pad};
  margin: ${theme.pad};
  width: 300px;
  background-color: ${theme.textInverted};
  max-height: 400;
  overflow-y: auto;
`;

class Card extends Component {
  static propTypes = {
    card: PropTypes.object,
    dispatch: PropTypes.func,
  }
  static contextTypes = {
    inverted: PropTypes.bool,
  }
  static renderEntities(entities) {
    return entities.map((entity) => {
      return (
        <View key={entity.name}>
          <Text
            style={{
              fontSize: 10,
              color: '#666',
              marginBottom: 0,
              textTransform: 'capitalize',
            }}
          >
            {entity.type.toLowerCase()}
          </Text>
          <Text style={{ textTransform: 'capitalize' }}>
            {entity.name.toLowerCase()}
          </Text>
        </View>
      );
    });
  }
  static renderRaw(results) {
    return results ? results.map((result) => {
      return (
        <View key={result.ParsedText}>
          <Text
            style={{
              fontSize: 10,
              color: '#666',
              marginBottom: 0,
              textTransform: 'capitalize',
            }}
          >
            Raw Text
          </Text>
          <Text style={{ color: '#666', }}>
            {result.ParsedText}
          </Text>
        </View>
      );
    }) : null;
  }
  download = () => {
    const {
      card,
    } = this.props;
    const vcard = vCard();
    const person = card.entities.find(entity => entity.type === 'PERSON');
    const organization = card.entities.find(entity => entity.type === 'ORGANIZATION');
    const locations = card.entities.filter(entity => entity.type === 'LOCATION');

    vCard.version = '3.0';
    vcard.firstName = person ? person.name.split(' ')[0] : null;
    vcard.lastName = person ? person.name.split(' ').slice(1).join(' ') : null;
    vcard.organization = organization ? organization.name : null;

    if (locations.length) {
      vcard.workAddress.label = 'Work Address';
      vcard.workAddress.street = locations.map(location => location.name).join(' ');
    }

    if (card.base64Image) {
      vcard.photo.embedFromString(card.base64Image, 'JPEG');
    }

    if (
      card.ocrResults
      && card.ocrResults.ParsedResults
    ) {
      vcard.note = card.ocrResults.ParsedResults.map(result => result.ParsedText).join('\n');
    }

    download(
      vcard.getFormattedString(),
      person ? `${person.name.replace(/[^a-zA-Z0-9-_\.]/g, '_')}.vcf` : 'contact.vcf',
      'text/vcf'
    );
  }
  remove = () => {
    const {
      card,
      dispatch,
    } = this.props;
    dispatch(removeCard(card.id));
  }
  render() {
    const {
      card,
    } = this.props;
    const person = card.entities.find(entity => entity.type === 'PERSON');
    const organization = card.entities.find(entity => entity.type === 'ORGANIZATION');

    const searchKeywords = person
      ? encodeURIComponent(`${person.name} ${organization ? organization.name : ''}`)
      : '';
    return (
      <StyledView
        inverted={this.context.inverted}
        {...this.props}
      >
        <Toolbar>
          {
            card.entities &&
            <Button
              icon="file-download"
              onPress={this.download}
            />
          }
          <Button
            icon="delete-forever"
            onPress={this.remove}
          />
          {
            person &&
            <Button
              href={`https://www.linkedin.com/search/results/index/?keywords=${searchKeywords}&origin=GLOBAL_SEARCH_HEADER`}
              icon="search"
            >
              LinkedIn
            </Button>
          }
        </Toolbar>
        {Card.renderEntities(card.entities)}
        <Image source={{ uri: card.base64Image }} style={{ width: 100, height: 50, marginBottom: 10 }} />
        {Card.renderRaw(card.ocrResults.ParsedResults)}
      </StyledView>
    );
  }
}

export default connect(() => ({}))(Card);

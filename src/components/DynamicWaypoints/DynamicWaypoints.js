import React, { Component } from 'react';
import _ from 'lodash';
import Waypoint from 'react-waypoint';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AnimateContainer from '../AnimateContainer/AnimateContainer';
import PhotoClip from '../PhotoClip/PhotoClip';

// ----------------------------------------------------------------
// Props for objects in the 'props.data' array
// ----------------------------------------------------------------
// label: 'string',
// content: 'any', - usually JSX or a string
// topOffset: 'string (number as px or %)' - optional,
// bottomOffset: 'string (number as px or %)' - optional,
// animationOrigin: 'string (bottom[default], top, left, or right',
// imageLink: 'string' - default null
// ----------------------------------------------------------------

class DynamicWaypoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: [],
      previousSection: []
    }
  }

  static propTypes = {
    data: PropTypes.array.isRequired
  };

  handleEnter(id, e) {
    // Check previousSection for item id and remove from that array
    let filteredArray = this.state.previousSection.filter(item => item !== id)
    this.setState({
      activeSection: [...this.state.activeSection, id],
      previousSection: filteredArray
    });
  }

  handleLeave(id, e) {
    // Remove item from activeSection array
    let filteredArray = this.state.activeSection.filter(item => item !== id)
    this.setState({ activeSection: filteredArray });
    if (e.currentPosition === 'above') {
      this.setState({ previousSection: [ ...this.state.previousSection, id] });
    }
  }

  renderWaypoints(waypoints) {
    return _.map(waypoints, (w, index) => {
      return (
        <Waypoint
          onEnter={ this.handleEnter.bind(this, index) }
          onLeave={ this.handleLeave.bind(this, index) }
          topOffset={ w.topOffset || 0 }
          bottomOffset={ w.bottomOffset || 0 }
          key={ index }
        >
          { w.imageLink
            ? <PhotoClip
                image={ w.imageLink }
                isActive={ _.includes(this.state.activeSection, index) }
                isPrevious={ _.includes(this.state.previousSection, index) }
                animationOrigin={ w.animationOrigin || 'bottom' }
              />
            : <AnimateContainer
                isActive={ _.includes(this.state.activeSection, index) }
                isPrevious={ _.includes(this.state.previousSection, index) }
                animationOrigin={ w.animationOrigin || 'bottom' }
              >
                { w.content }
              </AnimateContainer>
          }
        </Waypoint>
      );
    });
  }

  render() {
    return (
      <Container>{ this.renderWaypoints(this.props.data) }</Container>
    );
  }
}

export default DynamicWaypoints;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

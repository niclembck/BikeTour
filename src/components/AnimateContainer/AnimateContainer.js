import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class AnimateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: false
    }
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    isActive: PropTypes.bool.isRequired,
    isPrevious: PropTypes.bool.isRequired,
    animationOrigin: PropTypes.string
  };

  static defaultProps = {
    animationOrigin: 'bottom'
  }

  componentDidMount() {
    if (this.props.isActive) {
      this.setState({ viewState: 'active' });
    } else {
      this.setState({ viewState: 'inactive' });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPrevious) {
      this.setState({ viewState: 'previous' });
    } else if (nextProps.isActive) {
      this.setState({ viewState: 'active' });
    } else {
      this.setState({ viewState: 'inactive' });
    }
  }

  renderAnimationDirection(direction) {
    // Generate location areas for animation beased on animationOrigin prop
    if (direction === 'bottom') {
      return ['0px, -60px', '0px, 60px'];
    } else if (direction === 'left') {
      return ['-60px, 0', '-60px, 0'];
    } else if (direction === 'right') {
      return ['60px, 0', '60px, 0'];
    } else {
      return ['0, 60px', '0, -60px'];
    }
  }

  render() {
    return (
      <div ref={ this.props.innerRef}>
        <Container
          viewState={ this.state.viewState }
          animationOrigin={ this.renderAnimationDirection(this.props.animationOrigin) }
        >
          { this.props.children }
        </Container>
      </div>
    );
  }
}

export default AnimateContainer;

const Container = styled.div`
  will-change: transform, opacity;
  opacity: ${props => props.viewState === 'active' ? 1 : 0};
  transform: ${props => props.viewState === 'active'
    ? 'translate(0px, 0px)'
    : props.viewState === 'previous' ? `translate(${props.animationOrigin[0]})`
    : `translate(${props.animationOrigin[1]})`
  };
  transition: ${props => props.viewState === 'active'
    ? 'transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s, opacity 1s cubic-bezier(0.42, 0, 0.58, 1) 0s'
    : props.viewState === 'previous' ? 'transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s, opacity 1s cubic-bezier(0.42, 0, 0.58, 1) 0s'
    : 'transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s, opacity 1s cubic-bezier(0.42, 0, 0.58, 1) 0s'
  };
`;

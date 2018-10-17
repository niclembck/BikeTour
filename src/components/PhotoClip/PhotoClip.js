import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class PhotoClip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: false
    }
  }

  static propTypes = {
    image: PropTypes.string.isRequired,
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
  render() {
    return (
      <div ref={ this.props.innerRef } style={{ flex: 1 }}>
        <Image
          imageSource={ this.props.image }
          viewState={ this.state.viewState }
        />
      </div>
    );
  }
}

export default PhotoClip;

const Image = styled.div`
  height: 100%;
  width: 100%;
  background-image: url(${props => props.imageSource});
  background-size: cover;
  opacity: 1;
  clip-path: ${props => props.viewState === 'active'
    ? 'inset(0 0 0 0)'
    : 'inset(0 100% 0 0)'
  };
  transition: clip-path 2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s, opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
`;

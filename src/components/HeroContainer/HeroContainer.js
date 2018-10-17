import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HeroContainer = (props) => {
  return (
    <Container
      backgroundImage={ props.backgroundImage }
      fullHeight={ props.fullHeight }
    >
      { props.children }
    </Container>
  );
};

export default HeroContainer;

HeroContainer.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  fullHeight: PropTypes.bool
};

const Container = styled.div`
  width: 100%;
  height: ${props => props.fullHeight ? '100vh' : '75vh'};
  max-height: ${props => props.fullHeight ? '100vh' : '700px'};
  position: relative;
  overflow: hidden;
  background: ${props => props.backgroundImage
    ? `url(${props.backgroundImage}) no-repeat center center`
    : 'none'
  };
  background-size: cover;

  @media (max-width : 480px) {
    max-height: ${props => props.fullHeight ? '100vh' : '420px'};
  }

  img {
    height: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

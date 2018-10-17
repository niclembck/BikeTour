import React from 'react';
import styled from 'styled-components';

const BrowserContainer = (props) => {
  return (
    <Container>
      <TopBar>
        <Dots />
      </TopBar>
      <Content>
        <img src={ props.image } />
      </Content>
    </Container>
  );
};

export default BrowserContainer;

const dotSize = '6px';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 700px;
  border-radius: 3px;
  overflow: hidden;
`;
const TopBar = styled.div`
  background-color: #fff;
  padding: 5px 20px;
  height: 20px;
  display: flex;
  align-items: center;
`;
const Dots = styled.div`
  width: ${dotSize};
  height: ${dotSize};
  border-radius: 100%;
  background-color: #333;
  position: relative;

  &:before, &:after {
    content: '';
    width: ${dotSize};
    height: ${dotSize};
    border-radius: 100%;
    background-color: #333;
    position: absolute;
  }
  &:before {
    left: calc(-${dotSize} * 2);
  }
  &:after {
    left: calc(${dotSize} * 2);
  }
`;
const Content = styled.div`
  flex: 1;
  height: 380px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

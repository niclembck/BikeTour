import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CardLink = (props) => {
  return (
    <Card to={ props.link } title={ props.title }>
      <img src={ props.image } alt={ props.title } />
    </Card>
  );
};

export default CardLink;

const Card = styled(Link)`
  position: relative;
  display: block;
  cursor: pointer;
  overflow: hidden;
  min-width: 200px;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    z-index: 1;
  }

  &:after {
    content: "${props => props.title}";
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    background-color: rgba(255, 255, 255, .8);
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    color: #333;
    transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  &:hover {
    &:after {
      opacity: 1;
    }
  }
`;

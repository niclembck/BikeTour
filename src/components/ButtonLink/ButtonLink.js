import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ButtonLink = (props) => {
  return (
    <Container to={ props.link }>
      { props.children }
    </Container>
  );
};

export default ButtonLink;

const Container = styled(Link)`
  padding: 5px 10px;
  border: 1px solid #89cce7;
  background-color: transparent;
  color: #89cce7;
  text-decoration: none;
  font-weight: 400;

  &:hover {
    color: #fff;
    background-color: #89cce7;
    transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
`;

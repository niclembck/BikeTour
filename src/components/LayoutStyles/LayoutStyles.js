import styled from 'styled-components';

const LayoutStyles = {
  CenteredContent: styled.div`
    margin: 0 auto;
    max-width: 940px;
    padding: 50px 25px;
    @media (min-width : 1200px) {
      max-width: 1170px;
    }
  `,
  PaddedTextContainer: styled.div`
    padding-right: 100px;
    margin-bottom: 20px;
    @media (max-width : 480px) {
      padding: 0;
    }
  `,
  FullBleed: styled.div`
    width: 100%;
    padding: 10px 0;
    background-color: ${props => props.color}
  `
};

export default LayoutStyles;

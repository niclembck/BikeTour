import React from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import BikeTour from './modules/BikeTour/BikeTour';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <AppContainer>
      <PageContent>
        <Switch>
          <Route exact path="/" component={ BikeTour } />
        </Switch>
      </PageContent>
      <Footer />
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
`;
const PageContent = styled.div`
  position: relative;
  z-index: 2;
  background-color: #fff;
`;

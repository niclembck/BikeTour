import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import polyline from 'polyline';

import TourSection from './TourSection';

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: this.props.isExpanded,
      realData: {}
    };
  }

  componentDidMount() {
    this.setState({ realData: this.props.data.realData[0] });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isExpanded !== nextProps.isExpanded) {
      this.setState({ isExpanded: nextProps.isExpanded });
    }
  }

  renderRealCoords = (coords) => {
    const realCoords = polyline.decode(coords);
    const switchedCoords = _.map(realCoords, r => _.reverse(r));
    return switchedCoords;
  }

  render() {
    const { plannedData, realData } = this.props.data;

    return (
      <div>
        <SectionHeader onClick={ this.props.handleClick.bind(this) }>
          <SectionTitle id={ plannedData.id }>{ plannedData.title }</SectionTitle>
          { !this.state.isExpanded &&
            <div>Expand</div>
          }
        </SectionHeader>
        { this.state.isExpanded &&
          <SectionBody isExpanded={ this.state.isExpanded }>
            {
              this.state.isExpanded &&
              <TourSection
                plannedData={ plannedData }
                realData={ realData[0] }
                center={ plannedData.center }
                isExpanded={ this.state.isExpanded }
              />
            }
          </SectionBody>
        }
      </div>
    );
  }
}

export default Accordion;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d0d0d0;
  cursor: pointer;
`;
const SectionTitle = styled.div`
  padding: 10px 20px;
  font-size: 20px;
  flex: 1;
`;
const SectionBody = styled.div`
  padding: ${props => props.isExpanded ? '20px' : '0px'};
  border-bottom: ${props => props.isExpanded ? '1px solid #d0d0d0' : 'none'};
`;

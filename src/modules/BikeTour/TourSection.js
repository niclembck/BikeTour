import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import polyline from 'polyline';

import ReactMapboxGl, { Layer, Feature, ZoomControl } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibmljbGVtYmNrIiwiYSI6ImNqaXdhcmZmeTA3eTAzcG1vMTF3Y28zNnEifQ.ryovh1VEY7DOK3p0FrtHFA'
});

class TourSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      realCoords: []
    };
  }

  componentDidMount() {
    if (this.props.realData) {
      this.setState({ realCoords: this.renderRealCoords(this.props.realData.map.summary_polyline) });
    }

  }

  renderRealCoords = (coords) => {
    const realCoords = polyline.decode(coords);
    const switchedCoords = _.map(realCoords, r => _.reverse(r));
    return switchedCoords;
  }

  render() {
    const {
      plannedData,
      realData,
      center
    } = this.props;

    const { plannedRouteData } = plannedData;

    return (
      <div>
        <Row>
          <div>
            <MapContainer>
              <Map
                style="mapbox://styles/niclembck/cjj09kdq40cx12sqtoz209we2"
                center={ center }
                containerStyle={{ width: '100%', height: '100%' }}
                zoom={ [7] }
              >
                <ZoomControl />
                <Layer
                  type="line"
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round'
                  }}
                  paint={{
                    'line-color': '#3271ad',
                    'line-width': 8
                  }}
                >
                  <Feature coordinates={ plannedRouteData.features[0].geometry.coordinates } />
                </Layer>
                <Layer
                  type="line"
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round'
                  }}
                  paint={{
                    'line-color': '#e85a1d',
                    'line-width': 2
                  }}
                >
                  <Feature coordinates={ this.state.realCoords } />
                </Layer>
              </Map>
            </MapContainer>
          </div>

          <RightColumn>
            { !_.isEmpty(realData)
              ? <div>
                  <Title>{ realData.name }</Title>

                  <Legend>
                    <LegendBox realData />
                    <div>Actual Ride</div>
                  </Legend>

                  <Row>
                    <StatContainer>
                      <Label>Distance</Label>
                      <div>{ _.round(realData.distance / 1609.344, 1) } miles</div>
                    </StatContainer>
                    <StatContainer>
                      <Label>Average Speed</Label>
                      <div>{ _.round(realData.average_speed * 2.245) } mph</div>
                    </StatContainer>
                    <StatContainer>
                      <Label>Max Speed</Label>
                      <div>{ _.round(realData.max_speed * 2.245) } mph</div>
                    </StatContainer>
                  </Row>
                  <Row>
                    <StatContainer>
                      <Label>Elevation Gain</Label>
                      <div>{ _.round(realData.total_elevation_gain * 3.28) } feet</div>
                    </StatContainer>
                    <StatContainer>
                      <Label>Max Elevation</Label>
                      <div>{ _.round(realData.elev_high * 3.28) } feet</div>
                    </StatContainer>
                    <StatContainer>
                      <Label>Min Elevation</Label>
                      <div>{ _.round(realData.elev_low * 3.28) } feet</div>
                    </StatContainer>
                  </Row>
                </div>
              : <div>I didn't ride today</div>
            }
          </RightColumn>
        </Row>
      </div>
    );
  }
};

export default TourSection;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media(max-width : 480px) {
    display: block;
  }
`;
const Flex = styled.div`
  flex: 1;
`;
const RightColumn = styled.div`
  flex: 1;
  padding: 0 20px;
`;
const MapContainer = styled.div`
  width: 300px;
  height: 300px;

  @media(max-width : 480px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;
const Legend = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
`;
const LegendBox = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border: 1px solid #d0d0d0;
  box-shadow: inset 0 0 0 1px #fff;
  background-color: ${props => props.realData ? '#e85a1d' : '#3271ad'};
`;
const Title = styled.div`
  margin-bottom: 5px;
  font-weight: 600;
`;
const StatContainer = styled.div`
  margin-bottom: 20px;
  flex: 1;
  min-width: 120px;
`;
const Label = styled.div`
  font-size: 13px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 2px;
`;

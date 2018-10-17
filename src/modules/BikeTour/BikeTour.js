import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import ReactMapboxGl, { Layer, Feature, ZoomControl } from 'react-mapbox-gl';

import { fetchActivityList } from '../../actions/strava.actions';
import { getActivityList } from '../../selectors/strava.selectors';

import DynamicWaypoints from '../../components/DynamicWaypoints/DynamicWaypoints';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import TourSection from './TourSection';
import Accordion from './Accordion';

import scServices from './data/scServices.json';
import day1 from './data/day1.json';
import plannedTourData from './data/plannedTourData';

import LayoutStyles from '../../components/LayoutStyles/LayoutStyles';

const { CenteredContent, FullBleed } = LayoutStyles;

const sectionMap = [
  {
    label: 'Intro Header',
    content: <h1>July 2018 Bike Tour: PDX to LAX</h1>,
    topOffset: '50px',
    bottomOffset: '0%'
  },
  {
    label: 'Subtitle',
    content: <h4 style={{ color: '#054f94', marginBottom: 30 }}>Riding through the mountains and deserts of Oregon and California</h4>,
    topOffset: '50px',
    bottomOffset: 0
  }
];

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibmljbGVtYmNrIiwiYSI6ImNqaXdhcmZmeTA3eTAzcG1vMTF3Y28zNnEifQ.ryovh1VEY7DOK3p0FrtHFA',
  scrollZoom: false
});

class BikeTour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tourActivities: [],
      isLoading: true,
      activeSectionIndex: ""
    };
  }

  componentWillMount() {
    this.props.fetchActivityList();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isFetching && !_.isEmpty(nextProps.activityList)) {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(nextProps) {
    if (this.props.activityList !== nextProps.activityList) {
      // Check to make sure it is an activity from this year
      const currentYearActivities = _.filter(this.props.activityList, a => {
        return _.includes(a.start_date, 2018);
      });
      // Filter for activities from the tour
      const tourActivities = _.reverse(_.filter(currentYearActivities, a => {
        return _.includes(a.name,'Tour');
      }));
      this.setState({ tourActivities });
    }
  }

  renderAccordionSections = (data) => {
    return _.map(data, (d, idx) => {
      return (
        <Accordion
          data={ d }
          key={ idx }
          isExpanded={ this.state.activeSectionIndex === d.plannedData.id }
          handleClick={ this.handleAccordionClick.bind(this) }
        />
      );
    });
  }

  handleAccordionClick = (e) => {
    this.setState({ activeSectionIndex: e.target.id });
  }

  render() {
    const accordionData = _.map(plannedTourData, a => {
      const realTourData = _.filter(this.state.tourActivities, r => {
        return _.includes(r.name, a.id);
      });
      return {
        plannedData: a,
        realData: realTourData
      };
    });

    return (
      <Container>
        { this.state.isLoading
          ? <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          : <div style={{ flex: 1 }}>
              <MapContainer>
                <Map
                  style="mapbox://styles/niclembck/cjiwavesh9ggs2rl0vk8h2jkb"
                  center={ [-123.080312, 41.003205] }
                  containerStyle={{ width: '100%', height: '100%' }}
                  scrollZoom={ false }
                  zoom={ [5] }
                >
                  <ZoomControl />
                </Map>
              </MapContainer>
              <CenteredContent>
                <DynamicWaypoints data={ sectionMap } />
                { this.renderAccordionSections(accordionData) }
              </CenteredContent>
            </div>
        }
      </Container>
    );
  }
};

function mapStateToProps(state) {
  const activityList = getActivityList(state);
  return {
    activityList,
    isFetching: state.domain.strava.activityList.isFetching
  }
}

export default connect(mapStateToProps, { fetchActivityList })(BikeTour);

const Container = styled.div`
  display: flex;
  flex: 1;
`;
const LoadingContainer = styled.div`
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;
const MapContainer = styled.div`
  width: 100%;
  height: 70vh;

  @media(max-width : 480px) {
    height: 50vh;
  }
`;

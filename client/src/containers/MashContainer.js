import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Mash from '../components/Mash';
import SaveElement from '../components/SaveElement';
import {
  getMashWords,
  getTopMash,
  getRecentMashes,
  saveMash,
  getOlderSavedMash,
  setTopic,
  setSaved,
  setRecentMash,
} from '../actions/mashActions';

const PROPTYPES = {
  mash: PropTypes.shape({
    id: PropTypes.number,
    words: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        count: PropTypes.number,
      })
    ),
    loadingNew: PropTypes.bool,
    topic: PropTypes.string,
    loadingSaved: PropTypes.bool,
    saving: PropTypes.bool,
    saved: PropTypes.bool,
    error: PropTypes.bool,
    recentMashes: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        count: PropTypes.number,
      })
    ),
  }),
  getMashWords: PropTypes.func,
  getTopMash: PropTypes.func,
  getRecentMashes: PropTypes.func,
  saveMash: PropTypes.func,
  getOlderSavedMash: PropTypes.func,
  setRecentMash: PropTypes.func,
  setTopic: PropTypes.func,
  setSaved: PropTypes.func,
};

class MashContainer extends Component {
  componentDidMount() {
    this.updateRenderedMash();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.updateRenderedMash();
    }
  }

  updateRenderedMash() {
    const { topic, id } = this.props.match.params;
    const { recentMashes } = this.props.mash;
    const { getTopMash, setTopic } = this.props;
    if (topic) {
      this.getMashByTopic(topic);
    } else if (id) {
      this.getMashById(id);
    } else {
      setTopic('Top Stories');
      getTopMash();
    }
  }

  getMashByTopic(topic) {
    this.props.setTopic(topic);
    this.props.getMashWords(topic);
  }

  async getMashById(id) {
    await this.props.getRecentMashes();
    
    const { recentMashes, setTopic, setRecentMash, getOlderSavedMash } = this.props;
    const recentMash = recentMashes.find(mash => mash.id === parseInt(id));

    if (recentMash) {
      setTopic(recentMash.topic);
      setRecentMash(recentMash);
    } else {
      setTopic('Loading saved');
      getOlderSavedMash(id);
    }
  }

  render() {
    const {
      topic,
      words,
      loadingNew,
      loadingSaved,
      saving,
      saved,
      error,
    } = this.props.mash;
    const { id } = this.props.match.params;
    const { mash, recentMashes, saveMash, setSaved } = this.props;

    const topicTitleCase = topic ? `${_.startCase(_.replace(topic, /-/g, ' '))} Mash` : 'Just a moment...';

    let loadingMessage;
    if (loadingNew) {
      loadingMessage = 'Mashing up the news...';
    } else if (loadingSaved) {
      loadingMessage = 'Loading saved mash';
    } else if (error) {
      loadingMessage = 'Something is amiss. Please try again.';
    }

    let mashDisplay;
    if (loadingMessage) {
      mashDisplay = <div className="loading-message">{loadingMessage}</div>;
    } else {
      mashDisplay = <Mash words={words} />;
    }
    
    return (
      <div className="mash-container main-content">
        <div className="headline">{topicTitleCase}</div>
        <SaveElement
          {...{ id, mash, saving, saved, saveMash, setSaved, recentMashes }}
        />
        {mashDisplay}
        <div id="mash-canvas" />
      </div>
    );
  }
}

MashContainer.propTypes = PROPTYPES;

const mapStateToProps = state => {
  return { mash: state.mash, recentMashes: state.mash.recentMashes };
};

export default connect(
  mapStateToProps,
  { getMashWords, getTopMash, getRecentMashes, saveMash, getOlderSavedMash, setRecentMash, setTopic, setSaved }
)(MashContainer);

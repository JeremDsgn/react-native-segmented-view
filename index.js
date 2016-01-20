const React = require('react-native');
const { vw, vh, vmin, vmax } = require('./dimensions');

const {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  PropTypes,
} = React;

const screen = React.Dimensions.get('window');
const tweenState = require('react-tween-state');

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    alignItems: 'center'
  },
  bar: {
    backgroundColor: 'blue',
    position: 'absolute',
    height: 2,
    width: 46 * vw // Shoul be as a props
  }
});

const SegmentedView = React.createClass({
  mixins: [tweenState.Mixin],

  propTypes: {
    duration: PropTypes.number,
    onTransitionStart: PropTypes.func,
    onTransitionEnd: PropTypes.func,
    onPress: PropTypes.func,
    renderTitle: PropTypes.func,
    renderContent: PropTypes.func,
    titles: PropTypes.array,
    index: PropTypes.number,
    barColor: PropTypes.string,
    barPosition: PropTypes.string,
    underlayColor: PropTypes.string
  },

  getDefaultProps() {
    return {
      duration: 200,
      onTransitionStart: () => {},
      onTransitionEnd: () => {},
      onPress: () => {},
      renderTitle: null,
      renderContent: null,
      index: 0,
      barColor: '#44B7E1',
      barPosition:'top',
      underlayColor: 'transparent'
    };
  },

  getInitialState() {
    return {
      barLeft: 0,
      barRight: screen.width,
    };
  },

  componentDidMount() {
    setTimeout(() => this.moveTo(this.props.index), 0);
  },

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);

    this.moveTo(nextProps.index);
  },

  measureHandler(ox, oy, width) {
    this.tweenState('barLeft', {
      easing: tweenState.easingTypes.easeInOutQuad,
      duration: this.state.duration,
      endValue: ox
    });

    this.tweenState('barRight', {
      easing: tweenState.easingTypes.easeInOutQuad,
      duration: this.state.duration,
      endValue: screen.width - ox - width,
      onEnd: this.props.onTransitionEnd
    });

    setTimeout(this.props.onTransitionStart, 0);
  },

  moveTo(index) {
    this.refs[index].measure(this.measureHandler);
  },

  _renderTitle(title, i) {
    return (
      <TouchableHighlight key={ i } ref={ i } underlayColor={ this.props.underlayColor } onPress={ () => this.props.onPress(i) } style={ styles.title }>
        <Text style={[ this.props.titleStyle, i === this.props.index && this.props.selectedTitleStyle ]}>{ title }</Text>
      </TouchableHighlight>
    );
  },

  _renderContent(content, i) {
    return (
      <View key={ i }>
        { this.props.index === i ? content : undefined }
      </View>
    );
  },

  render() {
    const tabs = this.props.titles.map(this._renderTitle);
    const contents = this.props.elements.map(this._renderContent);

    const barContainer = (
      <View ref="bar" style={[styles.bar, {
        left: this.getTweeningValue('barLeft'),
        right: this.getTweeningValue('barRight'),
        backgroundColor: this.props.barColor
      }]} />
    );

    return (
      <View>
        <View { ...this.props } style={ this.props.style }>
          { this.props.barPosition == 'top' && barContainer }

          <View style={ styles.titleContainer }>
            { tabs }
          </View>

          { this.props.barPosition == 'bottom' && barContainer }
        </View>

        <View style={ this.props.contentStyle }>
          { contents }
        </View>
      </View>
    );
  }
});

module.exports = SegmentedView;

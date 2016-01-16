var React = require('react-native');
var { vw, vh, vmin, vmax } = require('./dimensions');

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  PropTypes,
} = React;

var screen = React.Dimensions.get('window');
var tweenState = require('react-tween-state');

var styles = StyleSheet.create({
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
    width: 46 * vw
  }
});

var SegmentedView = React.createClass({
  mixins: [tweenState.Mixin],

  propTypes: {
    duration: PropTypes.number,
    onTransitionStart: PropTypes.func,
    onTransitionEnd: PropTypes.func,
    onPress: PropTypes.func,
    renderTitle: PropTypes.func,
    titles: PropTypes.array,
    index: PropTypes.number,
    barColor: PropTypes.string,
    barPosition: PropTypes.string,
    underlayColor: PropTypes.string,
    selectedTitleStyle: PropTypes.object,
    titleStyle: PropTypes.object,
  },

  getDefaultProps() {
    return {
      duration: 200,
      onTransitionStart: () => {},
      onTransitionEnd: () => {},
      onPress: () => {},
      renderTitle: null,
      index: 0,
      barColor: '#44B7E1',
      barPosition:'top',
      underlayColor: 'transparent',
      selectedTitleStyle: null,
      titleStyle: null,
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
      <Text style={[ this.props.titleStyle, i === this.props.index && this.props.selectedTitleStyle ]}>{ title }</Text>
    );
  },

  renderTitle(title, i) {
    return (
      <TouchableHighlight key={ i } ref={ i } underlayColor={ this.props.underlayColor } onPress={ () => this.props.onPress(i) } style={ styles.title }>
        { this.props.renderTitle ? this.props.renderTitle(title, i) : this._renderTitle(title, i) }
      </TouchableHighlight>
    );
  },

  render() {
    var items = [];
    var titles = this.props.titles;

    for (var i = 0; i < titles.length; i++) {
      items.push(this.renderTitle(titles[i], i));
    }

    var barContainer = (
      <View ref="bar" style={[styles.bar, {
        left: this.getTweeningValue('barLeft'),
        right: this.getTweeningValue('barRight'),
        backgroundColor: this.props.barColor
      }]} />
    );

    return (
      <View { ...this.props } style={ this.props.style }>
        { this.props.barPosition == 'top' && barContainer }

        <View style={ styles.titleContainer }>
          { items }
        </View>

        { this.props.barPosition == 'bottom' && barContainer }
      </View>
    );
  }
});

module.exports = SegmentedView;

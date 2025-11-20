/**
 * Owner: borden@kupotech.com
 */
const IndexList = [
  {
    key: 'trendanalysis',
    title: '4c59b10295f14000acbb',
    children: [
      'Accumulative Swing Index',
      'Arnaud Legoux Moving Average',
      'Aroon',
      'Average Directional Index',
      'Chande Kroll Stop',
      'Double EMA',
      'Hull Moving Average',
      'Least Squares Moving Average',
      'Linear Regression Curve',
      'MA Cross',
      'MA with EMA Cross',
      'MACD',
      'Mass Index',
      'McGinley Dynamic',
      'Moving Average Channel',
      'Moving Average Exponential',
      'Moving Average Weighted',
      'Moving Average',
      'Smoothed Moving Average',
      'Triple EMA',
      'TRIX',
      'Vortex Indicator',
      'Williams Alligator',
      'Zig Zag',
    ],
  },
  {
    key: 'momentum',
    title: 'b4708250dbdf4000a275',
    children: [
      'Accumulation/Distribution',
      'Awesome Oscillator',
      'Chaikin Oscillator',
      'Chande Momentum Oscillator',
      'Commodity Channel Index',
      'Connors RSI',
      'Coppock Curve',
      'Detrended Price Oscillator',
      'Directional Movement',
      'KDJ',
      'Klinger Oscillator',
      'Know Sure Thing',
      'Momentum',
      'Parabolic SAR',
      'Price Oscillator',
      'Relative Strength Index',
      'Relative Vigor Index',
      'Relative Volatility Index',
      'SMI Ergodic Indicator/Oscillator',
      'Stochastic RSI',
      'Stochastic',
      'True Strength Index',
      'Ultimate Oscillator',
      'Williams %R',
    ],
  },
  {
    key: 'volatility',
    title: 'd126343cadf84000ae31',
    children: [
      'Average True Range',
      'Bollinger Bands %B',
      'Bollinger Bands Width',
      'Bollinger Bands',
      'Chop Zone',
      'Choppiness Index',
      'Donchian Channels',
      'Envelopes',
      'Historical Volatility',
      'Keltner Channels',
      'Price Channel',
    ],
  },
  {
    key: 'Volume',
    title: 'deb721556d0b4000a60a',
    children: [
      'Balance of Power',
      'Chaikin Money Flow',
      'Ease Of Movement',
      'Elder\'s Force Index',
      'Money Flow Index',
      'Net Volume',
      'On Balance Volume',
      'Price Volume Trend',
      'Volume Oscillator',
      'Volume',
      'VWAP',
      'VWMA',
    ],
  },
  {
    key: 'Others',
    title: '1d28275aea064000aaf4',
    children: [
      'Advance/Decline',
      'Fisher Transform',
      'Ichimoku Cloud',
      'Pivot Points Standard',
      'Rate Of Change',
      'Williams Fractal',
    ],
  },
];

/**
 * 缩写
 */
export const abbrObj = {
  'Moving Average Exponential': 'EMA',
  'Relative Strength Index': 'RSI',
};

/**
 * 所有指标
 */
export const AllIndexList = IndexList.reduce((res, item) => [...res, ...item.children], []);

export default IndexList;

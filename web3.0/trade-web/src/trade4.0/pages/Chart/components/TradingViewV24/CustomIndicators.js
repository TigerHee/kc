/**
 * Owner: borden@kupotech.com
 */
// 自定义指标
// https://www.tradingview.com/charting-library-docs/latest/custom_studies/ 参考文档
const genCustomIndicators = (PineJS) => {
  return Promise.resolve([
    {
      name: 'KDJ',
      metainfo: {
        _metainfoVersion: 51,
        id: 'KDJ/@tv-basicstudies-1',
        description: 'KDJ',
        shortDescription: 'KDJ',
        isCustomIndicator: true,
        format: {
          type: 'inherit',
        },
        is_hidden_study: false,
        is_price_study: false,
        scriptIdPart: '',
        defaults: {
          styles: {
            plot_0: {
              linestyle: 0,
              linewidth: 1,
              plottype: 0,
              trackPrice: false,
              transparency: 35,
              visible: true,
              color: '#0000FF',
            },
            plot_1: {
              linestyle: 0,
              linewidth: 1,
              plottype: 0,
              trackPrice: false,
              transparency: 35,
              visible: true,
              color: '#FF0000',
            },
            plot_2: {
              linestyle: 0,
              linewidth: 1,
              plottype: 0,
              trackPrice: false,
              transparency: 35,
              visible: true,
              color: '#80ff00',
            },
          },
          precision: 4,
          bands: [
            {
              color: '#808080',
              linestyle: 2,
              linewidth: 1,
              visible: true,
              value: 80,
            },
            {
              color: '#808080',
              linestyle: 2,
              linewidth: 1,
              visible: true,
              value: 20,
            },
          ],
          filledAreasStyle: {
            fill_0: {
              color: '#800080',
              transparency: 75,
              visible: true,
            },
          },
          inputs: {
            ilong: 9,
            isigK: 3,
            isigD: 3,
          },
        },
        inputs: [
          {
            id: 'ilong',
            type: 'integer',
            name: 'period',
            defval: 9,
            min: 1,
            max: 10000,
          },
          {
            id: 'isigK',
            type: 'integer',
            name: 'signal K',
            defval: 3,
            min: 1,
            max: 10000,
          },
          {
            id: 'isigD',
            type: 'integer',
            name: 'signal D',
            defval: 3,
            min: 1,
            max: 10000,
          },
        ],
        bands: [
          {
            id: 'hline_0',
            name: 'UpperLimit',
          },
          {
            id: 'hline_1',
            name: 'LowerLimit',
          },
        ],
        filledAreas: [
          {
            id: 'fill_0',
            objAId: 'hline_0',
            objBId: 'hline_1',
            type: 'hline_hline',
            title: 'Hlines Background',
          },
        ],
        plots: [
          { id: 'plot_0', type: 'line' },
          { id: 'plot_1', type: 'line' },
          { id: 'plot_2', type: 'line' },
        ],
        styles: {
          plot_0: { title: '%K', histogramBase: 0, joinPoints: false },
          plot_1: { title: '%D', histogramBase: 0, joinPoints: false },
          plot_2: { title: '%J', histogramBase: 0, joinPoints: false },
        },
      },
      // eslint-disable-next-line
      constructor: function () {
        function main(context, inputCallback) {
          this._context = context;
          this._input = inputCallback;

          const close = this._context.new_var(PineJS.Std.close(this._context));
          const high = this._context.new_var(PineJS.Std.high(this._context));
          const low = this._context.new_var(PineJS.Std.low(this._context));
          const ilong = this._input(0);
          const isigK = this._input(1);
          const isigD = this._input(2);
          const RSV = PineJS.Std.stoch(close, high, low, ilong, this._context);
          const pK = PineJS.Std.sma(this._context.new_var(RSV), isigK, this._context);
          const pD = PineJS.Std.sma(this._context.new_var(pK), isigD, this._context);
          const pJ = 3 * pK - 2 * pD;
          return [pK, pD, pJ];
        }
        this.main = main;
      },
    },
  ]);
};

export default genCustomIndicators;

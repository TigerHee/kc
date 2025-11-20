window.__customIndicators = [
  // {
  //   name: 'KDJ',
  //   metainfo: {
  //     _metainfoVersion: 40,
  //     description: 'KDJ',
  //     shortDescription: 'KDJ',
  //     is_hidden_study: false,
  //     is_price_study: true,
  //     isCustomIndicator: true,
  //     id: 'KDJ/@tv-basicstudies-1',
  //     scriptIdPart: '',
  //     name: 'KDJ',
  //     defaults: {
  //       styles: {
  //         plot_0: {
  //           linestyle: 0,
  //           linewidth: 1,
  //           plottype: 0,
  //           trackPrice: false,
  //           transparency: 35,
  //           visible: true,
  //           color: '#808000',
  //         },
  //         plot_1: {
  //           linestyle: 0,
  //           linewidth: 1,
  //           plottype: 0,
  //           trackPrice: false,
  //           transparency: 35,
  //           visible: true,
  //           color: '#000000',
  //         },
  //         plot_2: {
  //           linestyle: 0,
  //           linewidth: 1,
  //           plottype: 0,
  //           trackPrice: false,
  //           transparency: 35,
  //           visible: true,
  //           color: '#ffffff',
  //         },
  //       },
  //       precision: 4,
  //       bands: [{
  //         color: "#808080",
  //         linestyle: 2,
  //         linewidth: 1,
  //         visible: !0,
  //         value: 80
  //       }, {
  //         color: "#808080",
  //         linestyle: 2,
  //         linewidth: 1,
  //         visible: !0,
  //         value: 20
  //       }],
  //       filledAreasStyle: {
  //         fill_0: {
  //           color: "#800080",
  //           transparency: 75,
  //           visible: !0
  //         }
  //       },
  //       inputs: {
  //         ilong: 9,
  //         isigK: 3,
  //         isigD: 3,
  //       },
  //     },
  //     inputs: [
  //       {
  //         id: 'ilong',
  //         type: 'integer',
  //         name: 'period',
  //         defval: 9,
  //       },
  //       {
  //         id: 'isigK',
  //         type: 'integer',
  //         name: 'signal K',
  //         defval: 3,
  //       },
  //       {
  //         id: 'isigD',
  //         type: 'integer',
  //         name: 'signal D',
  //         defval: 3,
  //       },
  //     ],
  //     bands: [{
  //       id: "hline_0",
  //       name: "UpperLimit"
  //     }, {
  //       id: "hline_1",
  //       name: "LowerLimit"
  //     }],
  //     filledAreas: [{
  //       id: "fill_0",
  //       objAId: "hline_0",
  //       objBId: "hline_1",
  //       type: "hline_hline",
  //       title: "Hlines Background"
  //     }],
  //     plots: [
  //       { id: 'plot_0', type: 'line' },
  //       { id: 'plot_1', type: 'line' },
  //       { id: 'plot_2', type: 'line' },
  //     ],
  //     styles: {
  //       plot_0: { title: '%K', histogramBase: 0, joinPoints: false },
  //       plot_1: { title: '%D', histogramBase: 0, joinPoints: false },
  //       plot_2: { title: '%J', histogramBase: 0, joinPoints: false },
  //     },
  //   },
  //   constructor: function () {
  //     this.main = function (context, inputCallback) {
  //       this._context = context;
  //       this._input = inputCallback;

  //       var close = this._context.new_var(window.PineJS.Std.close(this._context));
  //       var high = this._context.new_var(window.PineJS.Std.high(this._context));
  //       var low = this._context.new_var(window.PineJS.Std.low(this._context));
  //       var ilong = this._input(0);
  //       var isigK = this._input(1);
  //       var isigD = this._input(1);
  //       var highInPeriod = window.PineJS.Std.highest(high, ilong, this._context);
  //       var lowInPeriod = window.PineJS.Std.lowest(low, ilong, this._context);
  //       var RSV = 100 * ((close - lowInPeriod) / (highInPeriod - lowInPeriod));
  //       console.log(close, high, low, ilong, isigK, isigD, highInPeriod, lowInPeriod, RSV);
  //       var pK = window.PineJS.Std.sma(RSV, isigK, this._context);
  //       var pD = window.PineJS.Std.sma(pK, isigD, this._context);
  //       var pJ = (3 * pK) - (2 * pD);
  //       return [pK, pD, pJ];
  //     };
  //   },
  // },
  {
    name: "KDJ",
    metainfo: {
      _metainfoVersion: 27,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: !0,
            color: "#0000FF"
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: !0,
            color: "#FF0000"
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 35,
            visible: !0,
            color: "#80ff00"
          }
        },
        precision: 4,
        bands: [{
          color: "#808080",
          linestyle: 2,
          linewidth: 1,
          visible: !0,
          value: 80
        }, {
          color: "#808080",
          linestyle: 2,
          linewidth: 1,
          visible: !0,
          value: 20
        }],
        filledAreasStyle: {
          fill_0: {
            color: "#800080",
            transparency: 75,
            visible: !0
          }
        },
        inputs: {
          in_0: 14,
          in_1: 1,
          in_2: 3
        }
      },
      plots: [{
        id: "plot_0",
        type: "line"
      }, {
        id: "plot_1",
        type: "line"
        }, {
          id: "plot_2",
          type: "line"
        }],
      styles: {
        plot_0: {
          title: "%K",
          histogramBase: 0,
          joinPoints: !1
        },
        plot_1: {
          title: "%D",
          histogramBase: 0,
          joinPoints: !1
        },
        plot_2: {
          title: "%J",
          histogramBase: 0,
          joinPoints: !1
        }
      },
      description: "KDJ",
      shortDescription: "KDJ",
      is_price_study: !1,
      bands: [{
        id: "hline_0",
        name: "UpperLimit"
      }, {
        id: "hline_1",
        name: "LowerLimit"
      }],
      filledAreas: [{
        id: "fill_0",
        objAId: "hline_0",
        objBId: "hline_1",
        type: "hline_hline",
        title: "Hlines Background"
      }],
      inputs: [{
        id: "in_0",
        name: "length",
        defval: 14,
        type: "integer",
        min: 1,
        max: 1e4
      }, {
        id: "in_1",
        name: "smoothK",
        defval: 3,
        type: "integer",
        min: 1,
        max: 1e4
      }, {
        id: "in_2",
        name: "smoothD",
        defval: 3,
        type: "integer",
        min: 1,
        max: 1e4
      }],
      id: "KDJ@tv-basicstudies-1",
      scriptIdPart: "",
      name: "KDJ"
    },
    constructor: function () {
      this.main = function (t, e) {
        var i, n, r, s, a, l, c, h, u, d, p, _, f, m, g, v, j;
        return this._context = t,
          this._input = e,
          i = this._input(0),
          n = this._input(1),
          r = this._input(2),
          s = window.PineJS.Std.close(this._context),
          a = window.PineJS.Std.high(this._context),
          l = window.PineJS.Std.low(this._context),
          c = this._context.new_var(s),
          h = this._context.new_var(a),
          u = this._context.new_var(l),
          d = window.PineJS.Std.stoch(c, h, u, i, this._context),
          p = this._context.new_var(d),
          _ = window.PineJS.Std.sma(p, n, this._context),
          f = this._context.new_var(_),
          m = window.PineJS.Std.sma(f, r, this._context),
          g = _,
          v = m,
          j = 3 * g - 2 * v,
          [g, v, j]
      }
    }
  },
];

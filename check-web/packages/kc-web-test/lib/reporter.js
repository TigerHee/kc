const { join } = require('path');

// Gitlab Regex: Total Coverage: (\d+\.\d+ \%)
module.exports = class CoverageReporter {
  constructor(globalConfig) {
    this.globalConfig = globalConfig;
    this.jsonSummary = join(this.globalConfig.coverageDirectory, 'coverage-summary.json');
  }
  async onRunComplete() {
    const coverage = require(this.jsonSummary);
    const scores =  ['lines', 'statements', 'functions', 'branches'];
    const totalSum = scores.map(i => coverage.total[i].pct)
      .reduce((a, b) => a + b, 0)
    const avgCoverage = totalSum / 4
    console.debug()
    console.debug('========= Total Coverage ============')
    console.debug(`Total Coverage: ${avgCoverage.toFixed(2)} %`)
    console.debug('=======================================')
    console.debug(scores.map(v => `${v}:${coverage.total[v].pct}`));
    console.debug('=======================================')
  }
}
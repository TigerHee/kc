export enum GuidanceStatus {
  needSignup = 1,
  needKyc,
  needDeposit,
  trade,
}

export type SensorSpm = string[];
export type SensorData = Record<string, any>;

export type SensorConfig = {
  spm: SensorSpm;
  data: SensorData;
};

export enum PositionType {
  Banner = 1,
  QuickStart,
}

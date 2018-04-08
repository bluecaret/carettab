export class Time {
  font: string;
  size: number;
  clocks: Clocks;
}

export class Clocks {
  item: Clock;
}

export class Clock {
  enable: boolean;
  timezone: string;
  label: string;
  size: number;
  font: string;
  seconds: Seconds;
  military: boolean;
  meridiem: Meridiem;
  delimiter: Delimiter;
  brackets: Brackets;
  analog: Analog;
}

export class Seconds {
  enable: boolean;
  blink: boolean;
  dim: boolean;
}

export class Meridiem {
  enable: boolean;
  dim: boolean;
}

export class Delimiter {
  enable: boolean;
  blink: boolean;
  dim: boolean;
}

export class Brackets {
  enable: boolean;
  dim: boolean;
  left: string;
  right: string;
}

export class Analog {
  enable: boolean;
  style: number;
}

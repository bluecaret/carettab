export class Clock {
  constructor(
    public label: string = '',
    public timezone: string = 'Automatic',
    public scaling: number = 50,
    public font: string = 'Roboto',
    public span: number = 10,
    public twentyFour: boolean = false,
    public seconds: Seconds = new Seconds(),
    public meridiem: Meridiem = new Meridiem(),
    public delimiter: Delimiter = new Delimiter(),
    public brackets: Brackets = new Brackets(),
    public analog: Analog = new Analog(),
  ) {}
}

export class Seconds {
  constructor(
    public enabled: boolean = false,
    public dim: boolean = false,
    public blink: boolean = false,
    public scaling: number = 50,
    public offset: number = 50
  ) {}
}

export class Meridiem {
  constructor(
    public enabled: boolean = true,
    public dim: boolean = true,
    public scaling: number = 50,
    public offset: number = 50
  ) {}
}

export class Delimiter {
  constructor(
    public enabled: boolean = true,
    public dim: boolean = true,
    public blink: boolean = false,
    public symbol: string = ':',
    public scaling: number = 50,
    public offset: number = 50
  ) {}
}

export class Brackets {
  constructor(
    public enabled: boolean = false,
    public dim: boolean = false,
    public left: string = '{',
    public right: string = '}',
    public scaling: number = 50,
    public offset: number = 50
  ) {}
}

export class Analog {
  constructor(
    public enabled: boolean = false,
    public style: number = 10
  ) {}
}

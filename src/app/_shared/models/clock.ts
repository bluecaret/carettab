export class Clock {
  constructor(
    public label: string = '',
    public timezone: string = 'Automatic',
    public scaling: number = 50,
    public font: string = 'Roboto',
    public seconds: Seconds = new Seconds(true, false, false),
    public twentyFour: boolean = false,
    public meridiem: Meridiem = new Meridiem(true, true),
    public delimiter: Delimiter = new Delimiter(true, true, true),
    public brackets: Brackets = new Brackets(true, true, '', ''),
    public analog: Analog = new Analog(false, 10),
  ) {}
}

export class Seconds {
  constructor(
    public enabled: boolean = true,
    public dim: boolean = false,
    public blink: boolean = false
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
    public blink: boolean = true,
    public scaling: number = 50,
    public offset: number = 50
  ) {}
}

export class Brackets {
  constructor(
    public enabled: boolean = true,
    public dim: boolean = true,
    public left: string = '',
    public right: string = '',
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

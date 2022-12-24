import { SharedService } from '../shared.service';

export class Clock {
  constructor(
    public id: string = SharedService.prototype.createID('CLOCK'),
    public label: Label = new Label(),
    public timezone: string = 'Automatic',
    public scaling: number = 5,
    public span: number = 100,
    public padding: number = 10,
    public marginHeight: number = 0,
    public marginWidth: number = 2,
    public position: string = 'c',
    public offset: number = 0,
    public twentyFour: boolean = false,
    public twoDigit: boolean = false,
    public relativeTime: RelativeTime = new RelativeTime(),
    public seconds: Seconds = new Seconds(),
    public meridiem: Meridiem = new Meridiem(),
    public delimiter: Delimiter = new Delimiter(),
    public brackets: Brackets = new Brackets(),
    public analog: Analog = new Analog(),
    public binary: Binary = new Binary(),
  ) {}
}

export class Label {
  constructor(
    public text: string = '',
    public enabled: boolean = true,
    public dim: boolean = false,
    public scaling: number = 10,
    public offset: number = 0
  ) {}
}

export class RelativeTime {
  constructor(
    public enabled: boolean = false,
    public dim: boolean = false,
    public scaling: number = 10,
    public offset: number = 0
  ) {}
}

export class Seconds {
  constructor(
    public enabled: boolean = false,
    public dim: boolean = false,
    public scaling: number = 20,
    public offset: number = 0
  ) {}
}

export class Meridiem {
  constructor(
    public enabled: boolean = true,
    public dim: boolean = false,
    public scaling: number = 10,
    public offset: number = 0,
    public am: string = 'am',
    public pm: string = 'pm'
  ) {}
}

export class Delimiter {
  constructor(
    public enabled: boolean = true,
    public dim: boolean = false,
    public blink: boolean = false,
    public symbol: string = ':',
    public scaling: number = 10,
    public offset: number = 0
  ) {}
}

export class Brackets {
  constructor(
    public enabled: boolean = false,
    public dim: boolean = false,
    public left: string = '[',
    public right: string = ']',
    public scaling: number = 10,
    public offset: number = 0,
    public padding: number = 1
  ) {}
}

export class Analog {
  constructor(
    public enabled: boolean = false,
    public style: number = 10
  ) {}
}

export class Binary {
  constructor(
    public enabled: boolean = false,
    public dim: boolean = false,
    public useNumbers: boolean = false,
    public onValueText: string = "1",
    public offValueText: string = "0",
  ) {}
}

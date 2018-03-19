export class Todo {
  id: number;
  title: string;
  complete: boolean;

  constructor(values: Object = {}) {
    this.title = '';
    this.complete = false;
    Object.assign(this, values);
  }
}

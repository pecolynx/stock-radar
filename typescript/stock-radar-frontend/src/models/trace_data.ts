export class TraceDataModel {
  type: string;
  x: string[];
  y: { [key: string]: number[] };
  constructor(type: string, x: string[], y: { [key: string]: number[] }) {
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

export class TraceDataListModel {
  list: TraceDataModel[];
  constructor(list: TraceDataModel[]) {
    this.list = list;
  }
}

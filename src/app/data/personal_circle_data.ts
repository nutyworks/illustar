export interface CircleData {
  _id: string;
  favorite: boolean;
  flag: number;
  notes: string;
}

export class PersonalData {
  VERSION: number = 1;
  circleDataList: { [key: string]: CircleData };

  constructor(circleDataList: CircleData[]) {
    let obj: { [key: string]: CircleData } = {};
    circleDataList.forEach((circle) => {
      obj[circle._id] = circle;
    })

    this.circleDataList = obj;
  }

  setCircleFavorite(_id: string, favorite: boolean): PersonalData {
    if (_id in this.circleDataList) {
      this.circleDataList[_id].favorite = favorite;
    } else {
      this.circleDataList[_id] = {
        _id: _id,
        favorite: favorite,
        flag: 0,
        notes: ''
      };
    }

    return new PersonalData(Object.values(this.circleDataList));
  }

  setCircleFlag(_id: string, flag: number): PersonalData {
    if (_id in this.circleDataList) {
      this.circleDataList[_id].flag = flag;
    } else {
      this.circleDataList[_id] = {
        _id: _id,
        favorite: false,
        flag: flag,
        notes: ''
      };
    }

    return new PersonalData(Object.values(this.circleDataList));
  }
}

export function createPersonalCircleDataFromCookieStr_migrate1(cookieStr: string): PersonalData {
  const circleDataaList = cookieStr.split(";")
    .map((x) => { 
      console.log(x);
      return {_id: x, favorite: true, flag: 0, notes: ""} as CircleData;
    })

  return new PersonalData(circleDataaList);
}

export function generatePersonalDataFromObject(obj: {
  VERSION: number;
  circleDataList: { [key: string]: CircleData };
}) {
  return new PersonalData(Object.values(obj.circleDataList));
}
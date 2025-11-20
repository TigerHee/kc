import '../src/index';

const dataURI = "data:application/json;base64,ew0KICAgICJtYWx0X3R5cGUiOiAibG9nIiwNCiAgICAibWFsdF9kYXRhIjogIldvdywgdSByIGFsbW9zdCB0aGVyZSA6TyINCn0=";

console.warn(fetch(dataURI)
  .then(response => response.json())
  .then((j) => {
    console.log('dataURI fetched with fetch:', j)
  }));

enum EUserType {
  Admin = 'admin',
  User = 'user',
}

interface IUser {
  name: string;
  age: number;
  type: EUserType | undefined;
}

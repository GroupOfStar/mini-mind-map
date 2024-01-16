interface Props<T> {
  items: T[];
  onValueChange: (vals: T[]) => void;
}
type ItemType = string | number;

// export const myComponent = <T extends ItemType>(props: Props<T>) => {
//   const { items = [], onValueChange } = props;

//   const myFunc = (item: ItemType) => {
//     //do something
//     console.log(item);
//     onValueChange([item]);
//   };

//   items.map((item) => myFunc(item));

//   myFunc("test");
// };

// type ItemType = string | number;
// export const myComponent = (props: Props<ItemType>) => {

//   const {
//     items = [],
//     onValueChange
//   } = props;

//   const myFunc = (item: ItemType) => {
//     //do something
//     console.log(item);
//     onValueChange([item])
//   }

//   items.map(item => myFunc(item));

//   myFunc('test');
// }

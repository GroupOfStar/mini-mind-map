import { randomTree as randomGraphTree } from "random-graph";

const randomTree = (size: number) => {
  return randomGraphTree({
    size: size - 1,
    attributes: {
      id: {
        type: "uuid"
      },
      name: {
        type: "randomString",
        options: {
          length: 0,
          maxLength: 16,
          categories: ["japanese", "letter", "chinese", "special"]
        }
      }
    }
  });
};

export default randomTree;

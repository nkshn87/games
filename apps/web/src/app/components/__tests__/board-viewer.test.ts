import { calculateOuterNumbers } from "../utils";

describe("calculateOuterNumbers", () => {
  it("returns an empty array when size is less than 3", () => {
    const size = 2;
    const result = calculateOuterNumbers(size);
    expect(result).toEqual([]);
  });

  it("returns the correct outer numbers for a given size", () => {
    const size = 4;
    const result = calculateOuterNumbers(size);
    expect(result).toEqual([1, 2, 3, 4, 7, 9, 13, 12, 11, 10, 8, 5]);
  });

  it("returns the correct outer numbers for a given size", () => {
    const size = 5;
    const result = calculateOuterNumbers(size);
    expect(result).toEqual([
      1, 2, 3, 4, 5, 8, 10, 12, 17, 16, 15, 14, 13, 11, 9, 6,
    ]);
  });

  it("returns the correct outer numbers for a given size", () => {
    const size = 6;
    const result = calculateOuterNumbers(size);
    expect(result).toEqual([
      1, 2, 3, 4, 5, 6, 9, 11, 13, 15, 21, 20, 19, 18, 17, 16, 14, 12, 10, 7,
    ]);
  });
});

// describe("calculateInnerNumbers", () => {
//     it("should return an array of inner numbers 5", () => {
//         const size = 5;
//         // prettier-ignore
//         const expected = [
//             7, 8, 9,
//             12, 13, 14,
//             17, 18, 19
//         ];
//         const result = calculateInnerNumbers(size);
//         expect(result).toEqual(expected);
//     });
//     it("should return an array of inner numbers 6", () => {
//         const size = 6;
//         // prettier-ignore
//         const expected = [
//             8, 9, 10, 11,
//             14, 15, 16, 17,
//             20, 21, 22, 23,
//             26, 27, 28, 29
//         ];
//         const result = calculateInnerNumbers(size);
//         expect(result).toEqual(expected);
//     });

//     it("should return an array of inner numbers 7", () => {
//         const size = 7;
//         // prettier-ignore
//         const expected = [
//             9, 10, 11, 12, 13,
//             16, 17, 18, 19, 20,
//             23, 24, 25, 26, 27,
//             30, 31, 32, 33, 34,
//             37, 38, 39, 40, 41,
//         ];
//         const result = calculateInnerNumbers(size);
//         expect(result).toEqual(expected);
//     });

//     it("should return an empty array when there are no inner squares", () => {
//         const size = 2;
//         const expected: number[] = [];
//         const result = calculateInnerNumbers(size);
//         expect(result).toEqual(expected);
//     });

//     it("should return an array of inner numbers when there is only one row and one column", () => {
//         const size = 1;
//         const expected: number[] = [];
//         const result = calculateInnerNumbers(size);
//         expect(result).toEqual(expected);
//     });
// });

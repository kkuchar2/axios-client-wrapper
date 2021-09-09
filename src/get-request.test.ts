import { composeUrl } from "./clientFunctions";

test("check composeUrl function for GET requests", () => {
  const apiUrl = "https://openlibrary.org/search";
  const params = { q: "j%20k%20rowling" };
  const expectation = "https://openlibrary.org/search?q=j%20k%20rowling";
  expect(composeUrl(apiUrl, params)).toBe(expectation);
});

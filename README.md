How to start-:

1. npm install
2. npm start

Special scenarios handling-:

- Response from the given api for flight search is limited. Only two dates are available and that is "2020/11/01", "2020/11/02". So if you enter any other dates in search filter then no results will be visible.

- Minimum layover time is given but no maximum layover time defined. So I have not added maximum layover time filter.

- For multiple flights scenario I have added handling for single hops only. For i.e. (A->B, B->C) = A->C. Not multiple hops like (A->B, B->C, C->D) = A->D

Things which are missing-:

- I have not added form validation for required fields.
- Also not able to manage time to write unit test cases.
- Used bootstrap for responsive design. Not written any additional media queries.

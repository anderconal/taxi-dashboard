**Task:** Take the data behind the API endpoint I will provide you in the "Context" section, and implement a small dashboard for exploring its data.

**Examples:**
1. Tests. Example of DOM Testing Library:

```javascript
// query utilities:
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
} from '@testing-library/dom'
// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom'

function getExampleDOM() {
  // This is just a raw example of setting up some DOM
  // that we can interact with. Swap this with your UI
  // framework of choice 😉
  const div = document.createElement('div')
  div.innerHTML = `
    <label for="username">Username</label>
    <input id="username" />
    <button>Print Username</button>
  `
  const button = div.querySelector('button')
  const input = div.querySelector('input')
  button.addEventListener('click', () => {
    // let's pretend this is making a server request, so it's async
    // (you'd want to mock this imaginary request in your unit tests)...
    setTimeout(() => {
      const printedUsernameContainer = document.createElement('div')
      printedUsernameContainer.innerHTML = `
        <div data-testid="printed-username">${input.value}</div>
      `
      div.appendChild(printedUsernameContainer)
    }, Math.floor(Math.random() * 200))
  })
  return div
}

test('examples of some things', async () => {
  const famousProgrammerInHistory = 'Ada Lovelace'
  const container = getExampleDOM()

  // Get form elements by their label text.
  // An error will be thrown if one cannot be found (accessibility FTW!)
  const input = getByLabelText(container, 'Username')
  input.value = famousProgrammerInHistory

  // Get elements by their text, just like a real user does.
  getByText(container, 'Print Username').click()

  await waitFor(() =>
    expect(queryByTestId(container, 'printed-username')).toBeTruthy(),
  )

  // getByTestId and queryByTestId are an escape hatch to get elements
  // by a test id (could also attempt to get this element by its text)
  expect(getByTestId(container, 'printed-username')).toHaveTextContent(
    famousProgrammerInHistory,
  )
  // jest snapshots work great with regular DOM nodes!
  expect(container).toMatchSnapshot()
})
```

2. Architecture: Example of Vertical Slicing Architecture combined with Clean Architecture:
```markdown
- src
    - main.ts
    - styles.css
    - slice1
        - domain
            - RichDomainModel.ts
            - CustomDomainError.ts
            - RepositoryAbstraction.ts
        - application
            - UseCase1.ts
        - infrastructure
            - ApiRepositoryImplementation.ts
            - user-interface
                - ContainerElement.ts
                - PresentationalElement1.ts
                - PresentationalElement2.ts
    - slice2
        - domain
            - RichDomainModel.ts
            - CustomDomainError.ts
            - RepositoryAbstraction.ts
        - application
            - UseCase1.ts
        - infrastructure
            - ApiRepositoryImplementation.ts
            - user-interface
                - ContainerElement.ts
                - PresentationalElement1.ts
                - PresentationalElement2.ts
    - shared
        - infrastructure
            - HttpAbstraction.ts
            - HttpImplementation.ts
    - dependency-injection  
        - Container.ts
        - ConstructorMetadataEmitor.ts
``` 
3. Dependency Injection. Example of diod npm library Container Usage:
```typescript
import { ContainerBuilder } from 'diod';
import { Http } from '../shared/infrastructure/http/Http';
import { TaxiTripRepository } from '../slices/profitabilityAnalysis/domain/TaxiTripRepository';
import { ApiTaxiTripRepository } from '../slices/profitabilityAnalysis/infrastructure/ApiTaxiTripRepository';

const builder = new ContainerBuilder();

builder.register(Http).use(HttpFetchApi);
builder.register(TaxiTripRepository).use(ApiTaxiTripRepository).withDependencies([Http]);

export const container = builder.build();
```
4. Dependency Injection. Example of Dependency Injection by Constructor:
```typescript
@ConstructorMetadataEmitter()
export class ApiTaxiTripRepository extends TaxiTripRepository {
  private static API_URL = import.meta.env.VITE_TINYBIRD_API_URL;
  private static API_TOKEN = import.meta.env.VITE_TINYBIRD_API_TOKEN;

  constructor(private http: Http) {
    super();
  }
}
```

**Prompt:** We need you to develop a small application to show the data behind the API endpoint, displaying it with a nice widget component. A widget for displaying any data. It can be a chart, a list, a counter,... whatever you decide. We encourage you to check the data behind the API endpoint I will provide you in the "Context" section first and decide what you want to visualize wisely. A filter for changing the information displayed in the widget. It can be a select, a list of checkboxes, a range... It depends on the story you want to tell through the data. You don't need to add tons of widgets, with just one is enough for us.

**Context:**
1. This is the endpoint we will get the data from: 
    - https://app.tinybird.co/gcp/europe-west3/endpoints/t_f3b68895534049bf859f38a8e5ebc51a?token=p.eyJ1IjogIjdmOTIwMmMzLWM1ZjctNDU4Ni1hZDUxLTdmYzUzNTRlMTk5YSIsICJpZCI6ICJmZTRkNWFiZS05ZWIyLTRjMjYtYWZiZi0yYTdlMWJlNDQzOWEifQ.P67MfoqTixyasaMGH5RIjCrGc0bUKvBoKMwYjfqQN8c
2. This is a response example of the endpoint we will use to get the data from:
```json
{
  "meta": [
    {
      "name": "vendorid",
      "type": "Int16"
    },
    {
      "name": "tpep_pickup_datetime",
      "type": "DateTime"
    },
    {
      "name": "tpep_dropoff_datetime",
      "type": "DateTime"
    },
    {
      "name": "passenger_count",
      "type": "Int16"
    },
    {
      "name": "trip_distance",
      "type": "Float32"
    },
    {
      "name": "ratecodeid",
      "type": "Int16"
    },
    {
      "name": "store_and_fwd_flag",
      "type": "String"
    },
    {
      "name": "pulocationid",
      "type": "Int32"
    },
    {
      "name": "dolocationid",
      "type": "Int32"
    },
    {
      "name": "payment_type",
      "type": "Int16"
    },
    {
      "name": "fare_amount",
      "type": "String"
    },
    {
      "name": "extra",
      "type": "Float32"
    },
    {
      "name": "mta_tax",
      "type": "Float32"
    },
    {
      "name": "tip_amount",
      "type": "Float32"
    },
    {
      "name": "tolls_amount",
      "type": "Float32"
    },
    {
      "name": "improvement_surcharge",
      "type": "Float32"
    },
    {
      "name": "total_amount",
      "type": "Float32"
    }
  ],
  "data": [
    {
      "vendorid": 1,
      "tpep_pickup_datetime": "2017-01-18 23:39:52",
      "tpep_dropoff_datetime": "2017-01-19 00:14:29",
      "passenger_count": 1,
      "trip_distance": 8.2,
      "ratecodeid": 1,
      "store_and_fwd_flag": "N",
      "pulocationid": 230,
      "dolocationid": 17,
      "payment_type": 1,
      "fare_amount": "28.5",
      "extra": 0.5,
      "mta_tax": 0.5,
      "tip_amount": 5.95,
      "tolls_amount": 0,
      "improvement_surcharge": 0.3,
      "total_amount": 35.75
    },
    {
      "vendorid": 1,
      "tpep_pickup_datetime": "2017-01-18 23:39:52",
      "tpep_dropoff_datetime": "2017-01-18 23:47:53",
      "passenger_count": 1,
      "trip_distance": 1.7,
      "ratecodeid": 1,
      "store_and_fwd_flag": "N",
      "pulocationid": 114,
      "dolocationid": 137,
      "payment_type": 1,
      "fare_amount": "8",
      "extra": 0.5,
      "mta_tax": 0.5,
      "tip_amount": 1,
      "tolls_amount": 0,
      "improvement_surcharge": 0.3,
      "total_amount": 10.3
    },
    {
      "vendorid": 1,
      "tpep_pickup_datetime": "2017-01-18 23:39:52",
      "tpep_dropoff_datetime": "2017-01-18 23:47:43",
      "passenger_count": 1,
      "trip_distance": 1.3,
      "ratecodeid": 1,
      "store_and_fwd_flag": "N",
      "pulocationid": 4,
      "dolocationid": 114,
      "payment_type": 1,
      "fare_amount": "7.5",
      "extra": 0.5,
      "mta_tax": 0.5,
      "tip_amount": 1.75,
      "tolls_amount": 0,
      "improvement_surcharge": 0.3,
      "total_amount": 10.55
    },
    {
      "vendorid": 2,
      "tpep_pickup_datetime": "2017-01-18 23:39:53",
      "tpep_dropoff_datetime": "2017-01-18 23:48:37",
      "passenger_count": 6,
      "trip_distance": 1.69,
      "ratecodeid": 1,
      "store_and_fwd_flag": "N",
      "pulocationid": 79,
      "dolocationid": 186,
      "payment_type": 1,
      "fare_amount": "8",
      "extra": 0.5,
      "mta_tax": 0.5,
      "tip_amount": 1.86,
      "tolls_amount": 0,
      "improvement_surcharge": 0.3,
      "total_amount": 11.16
    },
    {
      "vendorid": 2,
      "tpep_pickup_datetime": "2017-01-18 23:39:53",
      "tpep_dropoff_datetime": "2017-01-18 23:48:42",
      "passenger_count": 3,
      "trip_distance": 1.53,
      "ratecodeid": 1,
      "store_and_fwd_flag": "N",
      "pulocationid": 100,
      "dolocationid": 107,
      "payment_type": 2,
      "fare_amount": "8",
      "extra": 0.5,
      "mta_tax": 0.5,
      "tip_amount": 0,
      "tolls_amount": 0,
      "improvement_surcharge": 0.3,
      "total_amount": 9.3
    },
    {
      "vendorid": 1,
      "tpep_pickup_datetime": "2017-01-18 23:39:54",
      "tpep_dropoff_datetime": "2017-01-18 23:42:54",
      "passenger_count": 1,
      "trip_distance": 0.9,
      "ratecodeid": 1,
      "store_and_fwd_flag": "N",
      "pulocationid": 249,
      "dolocationid": 186,
      "payment_type": 1,
      "fare_amount": "4.5",
      "extra": 0.5,
      "mta_tax": 0.5,
      "tip_amount": 1.15,
      "tolls_amount": 0,
      "improvement_surcharge": 0.3,
      "total_amount": 6.95
    },
    {
      "vendorid": 2,
      "tpep_pickup_datetime": "2017-01-18 23:39:54",
      "tpep_dropoff_datetime": "2017-01-18 23:54:20",
      "passenger_count": 1,
      "trip_distance": 2.94,
      "ratecodeid": 1,
      "store_and_fwd_flag": "N",
      "pulocationid": 48,
      "dolocationid": 249,
      "payment_type": 2,
      "fare_amount": "12",
      "extra": 0.5,
      "mta_tax": 0.5,
      "tip_amount": 0,
      "tolls_amount": 0,
      "improvement_surcharge": 0.3,
      "total_amount": 13.3
    }
  ],
  "rows": 20,
  "rows_before_limit_at_least": 16384,
  "statistics": {
    "elapsed": 0.018893051,
    "rows_read": 16384,
    "bytes_read": 1203745
  }
}
```
3. The API endpoint has the following parameters:
    - format*. string (path). Response format: json or csv. Available values : json, csv. Default value : json
    - q string (query). SQL statement to run a query against the data returned by the endpoint (e.g SELECT count() FROM _)

**Constraints:**
1. You CAN'T use any JS framework. Use vanilla JavaScript, any ECMAScript specification. Prefer Vite + TypeScript. The technology must be supported by jsdom and happy-dom. Remember that jsdom does not support HTMLElement.
2. The app needs to have deep linking. Let the users of the app share the widgets with the filters applied.
3. You CAN use a JavaScript bundler. Prefer Vite.
4. Add tests, you CAN use any testing framework. No need to test everything, but at least show us how you approach testing. Prefer Vitest + Testing Library and, or Playwright. You may want to avoid the following implementation details: Internal state of a component, Internal methods of a component, Lifecycle methods of a component, Child components.
5. Make use of a combination of vertical slicing architecture with clean architecture.
6. Make use of dependency injection. Prefer diod npm library.
7. Focus on performance.
8. Prefer small, isolated and independent components.
9. The application MUST be responsive for the most common devices.
10. For the Charts, prioritize Apache ECharts.
11. Make use of ESLint and Stylelint as linting and formatting tools. The minimum would be: DO NOT allow any in TypeScript. Enforce double-quote usage. Enforce semicolons. Make it work automatically on save.
12. Make use of environment variables. For Vite, .env files are the ones recommended.
13. Provide me the step by step guide to implement this Feature.
14. Prioritize Baby Steps and Atomic Commits (an operation that applies a set of distinct changes as a single operation. If the changes are applied, then the atomic commit is said to have succeeded).
15. The look & feel should be similar to a decision-making dashboard. 
16. Apply needed styles to the whole app to adapt to this reality. General styles should be on styles.css, layout-related styles in the main layout component, and component-specific styles just in the components themselves (chart, filter...).
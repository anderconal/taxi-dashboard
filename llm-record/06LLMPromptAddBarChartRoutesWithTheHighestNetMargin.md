**Task:** Iterate on the existing application to add new Bar Chart.

**Examples:**
1. Architecture: Example of Vertical Slicing Architecture combined with Clean Architecture:
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
2. Dependency Injection. Example of diod npm library Container Usage:
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

**Prompt:** Iterate on the existing application to add a bar chart showing the routes with the highest net margin, filtered by a specific profit range.

**Context:**
1. Bar Chart: Routes with the Highest Net Margin (Filtered by Profit Range)

    Description: A bar chart showing the routes with the highest net margin, filtered by a specific profit range.

    Business Decisions:

        Route Optimization: Focus on promoting or increasing availability for the most profitable routes.
        Strategic Planning: Evaluate and adjust service areas or pricing strategies for routes that fall within specific profit ranges.

    Cost/Benefit Analysis:

        Benefit: High; directly targets profitability by highlighting high-margin routes.
        Development Time: Moderate; requires calculation of net margins and filtering based on profit criteria.

**Constraints:**
1. Keep the extraction and calculation of the net margin for each route by subtracting costs (e.g., tolls, taxes, etc.) from the total amount in the Domain layer, with a domain-enriched DDD approach.
2. Create a bar chart that displays the routes along the x-axis and their respective net margins on the y-axis.
3. Highlight or sort the routes by highest to lowest net margin for better clarity and emphasis on top performers.
4. Filter the routes based on a predefined profit range to focus on the most lucrative ones.
5. Maintain the current Architecture: Vertical Slicing Architecture combined with Clean Architecture.
6. Maintain the current dependency injection approach.
7. Add tests for the extraction and calculation of the net margin for each route by subtracting costs (e.g., tolls, taxes, etc.) from the total amount in the Domain layer, with a domain-enriched DDD approach. Make use of Vitest for this.
8. Provide me the step by step guide to implement this Feature.
9. Prioritize Baby Steps and Atomic Commits (an operation that applies a set of distinct changes as a single operation. If the changes are applied, then the atomic commit is said to have succeeded).

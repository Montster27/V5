# Code Style & Standards

## File Organization

1. **File Naming**
```typescript
// Components
MyComponent.tsx
MyComponent.test.tsx
MyComponent.types.ts
MyComponent.styles.ts

// Utilities
myUtil.ts
myUtil.test.ts

// Types
types.ts
interfaces.ts
```

2. **File Structure**
```typescript
// Imports
import React from 'react';
import { useDispatch } from 'react-redux';

// Types
interface Props {
  // ...
}

// Component
export const MyComponent: React.FC<Props> = () => {
  // ...
};

// Exports
export default MyComponent;
```

## Component Standards

1. **Component Organization**
```typescript
const MyComponent: React.FC<Props> = () => {
  // 1. Hooks
  const dispatch = useDispatch();
  const [state, setState] = useState();

  // 2. Derived State
  const computed = useMemo(() => {
    // ...
  }, []);

  // 3. Effects
  useEffect(() => {
    // ...
  }, []);

  // 4. Event Handlers
  const handleClick = () => {
    // ...
  };

  // 5. Render Methods
  const renderItem = () => {
    // ...
  };

  // 6. Return
  return (
    // ...
  );
};
```

2. **Props Interface**
```typescript
interface Props {
  // Required props first
  required: string;
  
  // Optional props last
  optional?: number;
  
  // Callbacks with 'handle' prefix
  handleChange?: (value: string) => void;
  
  // Children at end
  children?: React.ReactNode;
}
```

## State Management

1. **Redux**
```typescript
// Slice file structure
interface State {
  // ...
}

const initialState: State = {
  // ...
};

const slice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // ...
  }
});

// Selectors
export const selectFeature = (state: RootState) => state.feature;
```

2. **Local State**
```typescript
// Prefer single useState
const [state, setState] = useState<State>({
  value1: '',
  value2: 0
});

// Instead of multiple
const [value1, setValue1] = useState('');
const [value2, setValue2] = useState(0);
```

## Testing Standards

1. **Test Structure**
```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // ...
  });

  // Happy path
  it('should render successfully', () => {
    // ...
  });

  // Edge cases
  it('should handle error states', () => {
    // ...
  });
});
```

2. **Test Naming**
```typescript
// Component tests
ComponentName.test.tsx

// Unit tests
featureName.test.ts

// Integration tests
feature.integration.test.ts
```

## Type Standards

1. **Type Definitions**
```typescript
// Prefer interfaces for objects
interface User {
  id: string;
  name: string;
}

// Use type for unions/intersections
type Status = 'pending' | 'success' | 'error';

// Use enum for fixed sets
enum Direction {
  Up = 'UP',
  Down = 'DOWN'
}
```

2. **Type Exports**
```typescript
// types.ts
export interface ComponentProps {
  // ...
}

export type ComponentState = {
  // ...
};
```

## Documentation Standards

1. **Component Documentation**
```typescript
/**
 * Component description
 *
 * @param props - Props description
 * @param props.value - Value description
 * @returns JSX element
 *
 * @example
 * <MyComponent value={123} />
 */
```

2. **Function Documentation**
```typescript
/**
 * Function description
 *
 * @param param1 - Parameter description
 * @returns Return value description
 *
 * @throws {Error} Error description
 *
 * @example
 * const result = myFunction('test');
 */
```

## Git Commit Standards

1. **Commit Messages**
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update configs
```

2. **Branch Names**
```
feature/add-new-feature
bugfix/fix-error
docs/update-readme
config/update-jest
```
---
title: "React/Frontend"
order: 4
lang: "javascript"
---

# What you know about HTML?

- HTML (HyperText Markup Language) is the standard language for creating web pages, providing structure and layout.
- **HTML Elements**: Defined using tags. Block elements occupy a full line (`<div>`, `<h1>`). Inline elements share lines (`<span>`, `<img>`).
- **HTML Attributes**: Key/value pairs inside tags (e.g., `class`, `id`, `style`).
- **Structure**: `<!DOCTYPE html>` → `<html>` → `<head>` (metadata) + `<body>` (content).
- **Semantic Tags**: HTML5 added meaningful tags like `<header>`, `<footer>`, `<section>` for better accessibility.

# What do you know about CSS?

- **CSS (Cascading Style Sheets)** controls the layout and appearance of HTML elements.
- **Where to put CSS** (in order of precedence):
    1. **Inline CSS**: `style` attribute on HTML elements.
    2. **Internal CSS**: `<style>` tags in `<head>`.
    3. **External Style Sheets**: Linked via `<link>` tag (best practice).
- **CSS Box Model**: margin → border → padding → content.
- **Specificity**: `ID` > `Class` > `Element`. Last declared rule wins if tied.
- **Responsive Design**: Flexbox (1D), CSS Grid (2D), Media Queries.

# What is a promise object?

- **Promises** handle asynchronous operations. A Promise can be: **Pending**, **Fulfilled**, or **Rejected**.
- **Promise Methods**: `.then()` (success), `.catch()` (error), `.finally()` (always runs).
- **Keywords**: `async` declares a function returning a promise, `await` pauses until promise resolves.

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log('Fetch attempt completed.');
  }
}

fetchData();
```

# Advantage of using React vs plain JavaScript frontends?

- **Component-Based Architecture**: Reusable, modular components.
- **Virtual DOM**: Efficiently updates only necessary parts of the UI.
- **Declarative Syntax**: Describe desired UI state, React handles updates.
- **State Management**: Built-in hooks like `useState` and `useEffect`.
- **Rich Ecosystem**: React Router, Redux, Zustand.
- **Cross-Platform**: React Native for mobile apps.

# What is the DOM?

- The **DOM (Document Object Model)** is a programming interface representing HTML as a tree of nodes.
- **Nodes**: Elements (HTML tags), Text (content), Attributes (properties).
- **Manipulation**: JavaScript can change content, structure, or styling by modifying the DOM.

```javascript
document.getElementById('myText').innerHTML = 'Hello!';
document.createElement('div');
document.removeChild(element);
```

# What is the Virtual DOM?

- The **Virtual DOM** is a lightweight, in-memory representation of the actual DOM.
- Updating the actual DOM is expensive. The Virtual DOM minimizes these operations.
- **How it works**:
    1. State/Props change triggers re-render.
    2. React updates the virtual DOM tree (fast — just a JS object).
    3. **Diffing Algorithm** compares new vs previous virtual DOM.
    4. Only changed parts are updated in the real DOM (**reconciliation**).
    5. **Batching** groups multiple updates together.

# What is JSX?

- **JSX** (JavaScript XML) allows writing HTML-like code in JavaScript files.
- Transformed into `React.createElement` calls by Babel.
- **Key Features**: Dynamic content with `{}`, case sensitivity (lowercase = HTML, capitalized = React components), single root element required.

# What is TSX?

- **TSX** (TypeScript XML) is JSX with TypeScript features — static typing, interfaces, type checking.
- Compiled by TypeScript compiler with type safety for props, state, and function parameters.

# What are components in React?

- React applications are structured using **components** — modular, reusable building blocks.
- **Single Responsibility Principle**: Each component focuses on one piece of functionality.
- **Reusability**: Components reduce redundancy.
- **Single-Page Application (SPA)**: React dynamically swaps components without full page reloads.

# Class Component vs Function Component

- **Functional components** are plain functions that return JSX.
    - Simpler syntax, hooks support (`useState`, `useEffect`), lightweight.
    - **Use as default choice** for modern React.
- **Class components** extend `React.Component` with a `render()` method.
    - State via `this.state` / `this.setState()`, lifecycle methods.
    - **Use only** for legacy code or specific libraries.

# Describe the function component hooks you've used

- **`useState`**: Adds state to function components. Returns `[value, setter]`.
- **`useEffect`**: Performs side effects (fetching data, subscriptions, DOM updates).
    - Empty array `[]`: Runs only after initial render.
    - Variables in array: Runs when those variables change.
    - No array: Runs after every render.
    - **Cleanup function**: Cleans up before re-execution or unmounting.

# What is "export" in React?

- **Named Exports**: Export multiple items, import with exact name in `{}`.

```javascript
export const ComponentOne = () => <div>Component One</div>;
// import { ComponentOne } from './components';
```

- **Default Exports**: Export single item, import without `{}` with any name.

```javascript
const ComponentThree = () => <div>Component Three</div>;
export default ComponentThree;
// import CustomName from './components';
```

# What is props and state?

- **Props**: Read-only values passed from parent to child. Immutable.
- **State**: Dynamic data within a component that can change over time. Mutable via `useState` or `this.setState()`. Triggers re-renders.

# Can you send props from child to parent?

- Props flow one direction (parent → child). Use **callback functions** passed as props to communicate child → parent.

```javascript
// Parent
const ParentComponent = () => {
  const [message, setMessage] = useState('');
  const handleChildData = (data) => setMessage(data);
  return <ChildComponent sendDataToParent={handleChildData} />;
};

// Child
const ChildComponent = ({ sendDataToParent }) => {
  return <button onClick={() => sendDataToParent('Hello from Child!')}>Send</button>;
};
```

# How does Routing work in React? How did you create routes?

- **React Router** enables navigation between views without page reloads (SPA).
- **Key Components**: `BrowserRouter`, `Routes`, `Route`, `Link`

```javascript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </nav>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </BrowserRouter>
    );
}
```

# How can I render a list of elements in React?

- Use `.map()` to iterate over an array and return components. Assign a unique `key` prop.

```javascript
function App() {
  const fruits = ['Apple', 'Banana', 'Orange', 'Grape'];
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

# How can I conditionally render content in React?

- **Ternary operator** for inline conditional rendering:

```javascript
{isLoggedIn ? <h1>Welcome back!</h1> : <button>Log In</button>}
```

- **Logical AND** for render-if-true:

```javascript
{isLoggedIn && <p>You are logged in!</p>}
```

- **Switch statement** for multiple conditions.

# What is axios? What have you used it for?

- **Axios** is a promise-based HTTP client for making API requests.
- **Key Features**: Automatic JSON parsing, request/response interceptors, error handling, cancel requests, timeouts, concurrency.
- **Uses**: Making API requests, handling authentication tokens, form submission, error handling.

# React + Frontend Questions

# What you know about HTML?

- HTML (HyperText Markup Language) is the standard language for creating web pages, providing the structure and layout, while CSS styles it and JavaScript adds interactivity.
    - **Markup Language**: Descriptive, not a programming language.
    - **Structure**: HTML defines the structure using **elements** (tags) and **attributes** (metadata).
- **Syntax:**
    1. **HTML Elements**:
        - Defined using tags (e.g., `<div></div>`).
        - Two types:
            - **Block Elements**: Occupy a full line (e.g., `<div>`, `<h1>`).
            - **Inline Elements**: Share lines (e.g., `<span>`, `<img>`).
    2. **HTML Attributes**:
        - Key/value pairs inside tags (e.g., `<img src="image.jpg" alt="Description"/>`).
        - Common global attributes: `class`, `id`, `style`, `title`.
- **Structure:**
    - **Doctype Declaration**: `<!DOCTYPE html>` for HTML5.
    - **Root Tag**: `<html>` contains the page, divided into `<head>` (metadata) and `<body>` (content).
- **Additional Features:**
    - **Lists**: `<ul>` (unordered) and `<ol>` (ordered), with items in `<li>`.
    - **Tables**: `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>` (row), `<th>` (header cell), `<td>` (data cell).
    - **Forms & Inputs**: Various input types like text, password, checkboxes, and radio buttons, grouped within `<form>`.
    - **Semantic Tags**: HTML5 added meaningful tags like `<header>`, `<footer>`, and `<section>` for better accessibility.
    - **Media Embeds**: Tags like `<audio>` and `<video>` natively embed multimedia.
- **Modern Features:**
    - HTML5 introduced simpler **DOCTYPE** and **character encoding** (`<meta charset="UTF-8">`).
    - Semantic and multimedia support enhances functionality and accessibility.

---

# What do you know about CSS?

- **CSS (Cascading Style Sheets)** is a language used for styling HTML documents. It controls the layout and appearance of elements on a webpage.
    - It defines how HTML elements are displayed, including their position and appearance.
    - CSS is written as key/value pairs to target HTML elements.
- **Structure**:
    1. **Selectors**: Identify which HTML elements to style.
    2. **Declarations**: Define the styles for the selected elements.
- **Where can we put CSS (in order of precedence) ?**
    1. **Inline CSS** (within HTML elements):
        - Directly in the `style` attribute of an HTML element (not best practice, but useful in some cases).
    2. **Internal CSS** (within `<head>`):
        - Styles defined within the `<style>` tags in the HTML document’s `<head>`.
    3. **External Style Sheets** (Best practice):
        - Linked to the HTML document using a `<link>` tag.
- **CSS Box Model:** treats each HTML element as a box with four areas: margin, border, padding, and content.
    - **Margin**: Outer space between elements.
    - **Border**: Between margin and padding, editable to create visible borders.
    - **Padding**: Space between the content and the border.
    - **Content**: Actual element content, like text or images.
- **Common CSS Properties**
    - **Positioning**: Determines where on the page an element is placed: `static`, `relative`, `absolute`, `fixed`.
    - **Color**: Changes the color of elements (can use named colors, RGB, or HEX).
    - **Text Alignment**: Aligns text within the content (left, right, center).
    - **Font Styling**: Sets font-family, font-size, font-weight, font-style.
    - **Background**: Configures background color, image, size, and position.
- **CSS Selectors**
    - **Element Selectors**: Select all instances of an element (e.g., `p { color: blue; }`).
    - **ID Selectors**: Select elements by their `id` attribute (e.g., `#div1 { color: blue; }`).
    - **Class Selectors**: Select elements with a specific class (e.g., `.intro { color: blue; }`).
    - **Sibling Selectors**: Target an element immediately following another (e.g., `div + p { color: red; }`).
- **Conflicts**: Specificity determines the winning rule.
    - `ID` > `Class` > `Element`.
    - If specificity doesn’t resolve, the last declared rule wins.
- **Responsive Web Design:** ensures websites look good on all devices by resizing or repositioning elements based on screen size.
    - **Flexbox**: A one-dimensional layout system for row/column items.
    - **CSS Grid**: A two-dimensional layout system, great for complex designs.
- **CSS3 Concepts**
    - **Animations**: Use `@keyframes` to define the start and end states of an animation.
    - **CSS Variables**: Allow reusable values for styles (e.g., `-main-color: blue;`).
    - **Media Queries**: Apply styles based on viewport characteristics (e.g., for mobile responsiveness).

---

# What is a promise object?

- **Promises** in JavaScript are used to handle asynchronous operations, providing a cleaner alternative to callback functions. A **Promise** represents a value that may not yet be available but will be resolved in the future. The Promise object can be in one of three states:
    - **Pending**: The initial state, neither fulfilled nor rejected.
    - **Fulfilled**: The operation completed successfully.
    - **Rejected**: The operation failed, and an error occurred.
- **Workflow:**
    - The browser sends a request to the server and creates a promise for the response.
    - If the request fails (e.g., an error code), the promise is rejected.
    - On success, the promise resolves and provides the response data.
- A **Promise** is created using the **`new Promise`** constructor, which takes an executor function. The executor function receives two callbacks:
    - **resolve(value)**: Called when the operation succeeds, passing the result.
    - **reject(error)**: Called if the operation fails, passing the error.
- **Promise Methods:**
    - **`.then()`**: Handles the success case when the Promise is fulfilled.
    - **`.catch()`**: Handles the error case when the Promise is rejected.
    - **`.finally()`**: Executes code after the Promise settles (whether fulfilled or rejected).
- **Accessing the Response Body:**
    - `response.json()`: Parses the response as JSON and returns a JavaScript object.
    - `response.text()`: Returns the response as plain text.
- **Keywords:**
    - **`async`**: Declares a function to return a promise.
    - **`await`**: Pauses an `async` function until the promise resolves.
- example:
    
    ```jsx
    async function fetchData() {
      try {
        const response = await fetch('https://api.example.com/data'); // Sends request
        const data = await response.json(); // Waits for and parses the response
        console.log(data); // Uses the resolved data
      } catch (error) {
        console.error('Error:', error); // Handles errors
      } finally {
        console.log('Fetch attempt completed.'); // Runs after success or error
      }
    }
    
    fetchData();
    ```
    

---

# Advantage of using React vs plain JavaScript frontends?

- **Component-Based Architecture**: React promotes reusable components, making code modular and easier to maintain.
- **Virtual DOM**: React efficiently updates and renders only the necessary parts of the UI, improving performance.
- **Declarative Syntax**: Developers describe the desired UI state, and React handles the updates automatically.
- **State Management**: Built-in hooks like `useState` and `useEffect` simplify managing dynamic data and side effects.
- **Rich Ecosystem**: Libraries like React Router for routing and tools like Redux or Zustand for advanced state management make development more efficient.
- **Community and Resources**: A large community provides extensive documentation, tutorials, and third-party tools.
- **Cross-Platform Development**: With React Native, you can use the same knowledge to build mobile apps.

---

# **What is the DOM?**

- The **DOM (Document Object Model)** is a programming interface for web documents. It represents the structure of an HTML or XML document as a tree of nodes, where each node corresponds to a part of the document, such as an element, attribute, or piece of text.

![image.png](React%20+%20Frontend%20Questions/image.png)

- **Nodes**:
    - Elements: HTML tags like `<div>`, `<p>`, `<h1>`, etc.
    - Text: The content inside HTML tags.
    - Attributes: Properties of HTML tags (e.g., `class`, `id`, `src`).
- **DOM Tree**:
    - The DOM is structured as a tree, with each HTML element being a node in the tree. The root of the tree is the `<html>` tag, and branches represent child elements like `<head>`, `<body>`, and so on.
- **Manipulation**: JavaScript can be used to change the content, structure, or styling of the page by modifying the DOM. For example:
    - Changing text: `document.getElementById('myText').innerHTML = 'Hello!'`
    - Adding an element: `document.createElement('div')`
    - Removing an element: `document.removeChild(element)`

---

# What is the Virtual DOM.

- The **Virtual DOM** is a lightweight, in-memory representation of the actual DOM. It allows React to manage updates efficiently without directly interacting with the DOM every time a change is needed.
- Updating the **actual DOM** (or the browser DOM) is computationally expensive and can slow down performance, especially for complex UIs with frequent updates.
    - Each update involves recalculations, layout reflows, and repainting, which can degrade user experience.
    - The **virtual DOM** minimizes these expensive operations by batching changes and updating only the necessary parts of the real DOM.
- The **Virtual DOM** in React enhances performance by optimizing how the DOM is updated:
    1. **State/Props Change**: When a component’s state or props change, React triggers a re-render of the component.
    2. **Re-render in Virtual DOM**: React updates the virtual DOM tree, which is fast because it’s just a JavaScript object.
    3. **Diffing Algorithm**: React compares the new virtual DOM with the previous one to identify what has changed.
    4. **Efficient DOM Updates**: Instead of updating the entire DOM, React only updates the parts that have changed, a process called **reconciliation**.
    5. **Batching Updates**: React groups multiple updates together to minimize the number of actual DOM updates, further boosting performance.

---

# What is JSX?

- **JSX** (JavaScript XML) is a syntax extension for JavaScript, commonly used with React, that allows you to write HTML-like code directly in your JavaScript files.
    - It simplifies the process of defining UI structures and improves code readability by visually representing the component's structure within the script.
- **Key Features of JSX:**
    1. **HTML-like Syntax**: Enables writing HTML tags inside JavaScript, making it easier to structure the UI.
    2. **JavaScript Equivalent**: JSX is transformed into `React.createElement` calls by a compiler like Babel.
    3. **Dynamic Content**: JavaScript expressions can be embedded in JSX using curly braces.
    4. **Case Sensitivity**: Lowercase tags are interpreted as HTML elements, while capitalized tags represent React components.
    5. **Single Root Element**: Each JSX block must have one root element.
    6. **Fragments**: Use `React.Fragment` or shorthand to group elements without additional DOM nodes.
- **How JSX Works:**
    1. **Compilation by Babel**: JSX is not valid JavaScript by default and needs a tool like Babel to convert it into `React.createElement`.
    2. **Integration with React**: JSX works seamlessly with React, where tags represent DOM elements or React components, depending on their casing.

---

# What is TSX?

- **TSX** (TypeScript XML) is a syntax extension for TypeScript, similar to JSX but with additional TypeScript features, such as static typing, interfaces, and type checking.
    - It is commonly used in React applications with TypeScript to provide enhanced development experiences through type safety.
- **Key Features of TSX:**
    1. **TypeScript with HTML-like Syntax**: TSX allows developers to write HTML-like code within TypeScript files while benefiting from TypeScript's type system.
    2. **Static Typing**: TSX enables static type checking for JSX elements, props, and state, ensuring better type safety and error prevention.
    3. **JavaScript Expressions**: JavaScript expressions can still be embedded in curly braces, and these can now be type-checked.
    4. **Case Sensitivity**: Just like JSX, lowercase tags are interpreted as HTML elements, and capitalized tags are interpreted as React components.
    5. **Single Root Element**: Each TSX block must have one root element, similar to JSX.
    6. **Fragments**: TSX supports `React.Fragment` or shorthand syntax (`<> </>`) to group elements without adding unnecessary DOM nodes.
- **How TSX Works:**
    1. **Compilation by TypeScript**: TSX files are compiled by TypeScript and a bundler (e.g., Webpack) into regular JavaScript. The TypeScript compiler also checks for type errors and ensures that the code is type-safe.
    2. **TypeScript Integration**: TSX integrates tightly with TypeScript’s type system, allowing for better tooling, autocompletion, and debugging. Type annotations for props, state, and function parameters can be added for better type safety.

---

# What are components in React?

- **React** applications are structured using **components**, which are modular and reusable building blocks of the user interface.
- **Key Principles of React Components**
    - **Single Responsibility Principle**: Each component should focus on a single piece of functionality or behavior within the application. This ensures clarity and simplifies debugging.
    - **Reusability**: Components are designed to be reusable across the application, reducing redundancy and enhancing maintainability.
    - **Separation of Concerns**: Components help divide the UI into manageable pieces, keeping layout, logic, and styling organized.
- **Rendering Components in React**
    - Rendering means displaying components on the page. React renders components by injecting them into the root HTML element (typically defined in the `index.html` file).
    - The entry point for this process is the root component, such as `App.tsx`, which orchestrates the display of child components.
- **Single-Page Application (SPA) Model**
    - React simulates multi-page navigation within a single HTML file by dynamically swapping components in and out of the view.
    - This avoids full page reloads, enhancing speed and user experience.

---

# Class Component vs Function Component

- React components can be created using **class components** or **functional components**, each with its own features and use cases.
- **Functional components** are plain JavaScript or TypeScript functions that return JSX.
    - **Simpler Syntax**: Defined as a function that takes `props` as an argument and returns JSX.
    - **Hooks Support:** With the introduction of React hooks (e.g., `useState`, `useEffect`), functional components can manage state and lifecycle events.
    - **Lightweight:** Focus primarily on rendering UI and are easier to test and debug.
    - **Use Case:** Ideal for components that primarily handle UI rendering or need to manage simple state or lifecycle logic.
- **Class components** are ES6 classes that extend `React.Component` and include a `render()` method to return JSX.
    - **State Management**: Manage state using `this.state` and update it with `this.setState()`.
    - **Lifecycle Methods**: Provide access to lifecycle methods such as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.
    - **Verbose Syntax**: Require more boilerplate, including a `constructor` for state initialization and `this` binding.
    - **Use Case:** Commonly used in earlier React versions (before hooks) for handling complex state or lifecycle logic.
- **Conclusion**
    - Use **functional components** as the default choice for writing modern React applications.
    - Use **class components** only if you're working with legacy code or specific libraries that depend on class-based patterns.

---

# Describe the function component hooks you've used.

- **Hooks** in React allow function components to access features like state and lifecycle methods.
    - Prior to hooks, state and lifecycle features were only available in class components.
    - Hooks make development simpler, enabling state and other React features in function components without class-based components.
- The **`useState`** hook:
    - Adds state to function components.
    - Returns an array of 2 elements:
        1. The current state value.
        2. A function to update the state.
    - You can call **`useState`** multiple times in a component to manage multiple pieces of state, unlike class components, which have a single state object.
- The **`useEffect`** hook:
    - Performs side effects such as fetching data, subscribing to services, or updating the DOM.
    - Combines the behaviors of **`componentDidMount`**, **`componentDidUpdate`**, and **`componentWillUnmount`** from class components into a unified API.
    - **Effect function**: Executes logic after the component renders.
    - **Dependency array**:
        - Empty array (`[]`): Runs only after the initial render.
        - Variables in the array: Runs when those variables change.
        - No array: Runs after every render (use cautiously).
    - **Cleanup function**: Cleans up resources (e.g., unsubscribing) before re-execution or unmounting.

---

# What is "export" in React?

- In React (and JavaScript in general), the **`export`** keyword is used to make variables, functions, classes, or components available for use in other files or modules.
    - React applications typically use **`export`** to organize code into reusable modules and maintain a clean, modular structure.
- **Named Exports**
    - Named exports allow you to export multiple items from a file.
    - Each exported item must be imported with its exact name in curly braces `{}`.
    - **Syntax:**
        
        ```jsx
        export const ComponentOne = () => <div>Component One</div>;
        export const ComponentTwo = () => <div>Component Two</div>;
        ```
        
    - **Importing:**
        
        ```jsx
        import { ComponentOne, ComponentTwo } from './components';
        ```
        
- **Default Exports**
    - Default exports allow you to export *a single item* from a file.
    - This item can be imported without curly braces and can have a custom name when imported.
    - **Syntax:**
        
        ```jsx
        const ComponentThree = () => <div>Component Three</div>;
        export default ComponentThree;
        ```
        
    - **Importing:**
        
        ```jsx
        import CustomName from './components';
        ```
        
- **When to Use `export` in React**
    - Use **named exports** when exporting multiple components, utility functions, or constants from a file.
    - Use **default exports** when a file has one primary component or module that represents its main functionality.

---

# What is props and state?

- In React, **props** and **state** are two key concepts for managing data within components. Understanding the difference between the two is essential for building dynamic and interactive applications.
- **Props** (short for "properties") are **read-only values** passed from a parent component to a child component. Props allow components to communicate with each other and share data.
    - Props are passed down from parent to child.
    - Props are **immutable**, meaning that a child component cannot modify the props it receives.
- **State** is used to manage dynamic data within a component that can change over time. Unlike props, **state is mutable**, and can be updated using specific functions.
    - In **class components**, state is initialized inside the constructor and updated using **`this.setState()`**.
    - In **functional components**, state is managed using the **`useState`** hook.
    - State allows components to react to user inputs, events, or external data changes by triggering re-renders with the updated data.

---

# Can you send props from child to parent?

- In React, **props flow in one direction** from parent to child. By default, you cannot send props directly from a child to a parent, as React's architecture is designed for a top-down data flow.
    - However, you can enable communication **from child to parent** using **callback functions** passed as props from the parent component to the child.
- To send data from a **child to its parent**, the parent passes a function to the child via props. The child then calls this function, optionally providing arguments, which the parent can use.
    1. Define a callback function in the parent component.
    2. Pass the callback function as a prop to the child component.
    3. Call the callback function inside the child component, passing any required data as arguments.
    4. The parent component processes the data.
- **Example:**
    
    ```jsx
    // ParentComponent.js
    import React, { useState } from 'react';
    import ChildComponent from './ChildComponent';
    
    const ParentComponent = () => {
      const [message, setMessage] = useState('');
    
      // Callback function to handle data from the child
      const handleChildData = (data) => {
        setMessage(data);
      };
    
      return (
        <div>
          <h1>Parent Component</h1>
          <p>Message from child: {message}</p>
          <ChildComponent sendDataToParent={handleChildData} />
        </div>
      );
    };
    
    export default ParentComponent;
    
    // ChildComponent.js
    import React from 'react';
    
    const ChildComponent = ({ sendDataToParent }) => {
      const handleClick = () => {
        sendDataToParent('Hello from Child!');
      };
    
      return (
        <div>
          <h2>Child Component</h2>
          <button onClick={handleClick}>Send Data to Parent</button>
        </div>
      );
    };
    
    export default ChildComponent;
    ```
    

---

# How does Routing work in React? How did you create routes?

- **Routing in React** allows you to navigate between different views or pages in your application without reloading the entire page. It helps you create **Single Page Applications (SPAs)** where content updates dynamically based on user interaction, while maintaining the application's state.
    - **React Router** uses a declarative approach to define routes and their associated components.
    - The router listens for changes in the browser's URL, and based on that, it renders the corresponding component.
- **Key Components of React Router:**
    1. **BrowserRouter** (or Router):
        - It wraps the entire application, providing routing functionality.
        - It listens for changes in the URL and renders the appropriate component.
    2. **Routes**:
        - Replaces the older `Switch` component (from React Router v5) to group multiple `Route` components.
        - Only the first `Route` that matches the current URL is rendered.
    3. **Route**:
        - Defines individual routes in the application.
        - A route maps a specific path (URL) to a React component.
        - When the URL matches a route's path, the specified component is rendered.
    4. **Link**:
        - Used to navigate between different routes.
        - It prevents full page reloads and allows navigation within the SPA.
    5. **useHistory (for programmatic navigation)**:
        - Allows navigation via JavaScript, useful for conditional redirects or actions after form submission.
- **Example:**
    
    ```jsx
    import React from 'react';
    import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
    
    // Sample components
    function HomePage() {
        return <h1>Home Page</h1>;
    }
    
    function AboutPage() {
        return <h1>About Page</h1>;
    }
    
    function ContactPage() {
        return <h1>Contact Page</h1>;
    }
    
    // Main App component
    function App() {
        return (
            <BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </BrowserRouter>
        );
    }
    
    // Navigation component
    function Navigation() {
        return (
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
        );
    }
    
    export default App;
    ```
    

---

# How can I render a list of elements in React?

- To render a list of elements in React, you can map over an array of data and return a list of components or elements.
    1. **Prepare an Array**: You need an array of data that you want to render. This can be any type of array (strings, numbers, objects, etc.).
    2. **Use `.map()` Method**: Use the `.map()` method to iterate over the array and return a React component for each item.
    3. **Assign a Unique Key**: Each item in the list should have a unique `key` prop to help React efficiently update and manage the list.
- **Example:**
    
    ```jsx
    import React from 'react';
    
    function App() {
      const fruits = ['Apple', 'Banana', 'Orange', 'Grape'];
    
      return (
        <div>
          <ul>
            {fruits.map((fruit, index) => (
              <li key={index}>{fruit}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    export default App;
    ```
    

---

# How can I conditionally render content in React?

- In React, you can conditionally render content based on the state, props, or other conditions using different techniques.
- You can use an `if` statement inside the component's body to determine what content to render.
    
    ```jsx
    import React, { useState } from 'react';
    
    function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(false);
    
      if (isLoggedIn) {
        return <h1>Welcome back, user!</h1>;
      } else {
        return <button onClick={() => setIsLoggedIn(true)}>Log In</button>;
      }
    }
    
    export default App;
    ```
    
- The **ternary operator** is a concise way to conditionally render content inline.
    
    ```jsx
    import React, { useState } from 'react';
    
    function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(false);
    
      return (
        <div>
          {isLoggedIn ? (
            <h1>Welcome back, user!</h1>
          ) : (
            <button onClick={() => setIsLoggedIn(true)}>Log In</button>
          )}
        </div>
      );
    }
    
    export default App;
    ```
    
- If you want to render something only when a condition is true, you can use the logical AND (`&&`) operator.
    
    ```jsx
    import React, { useState } from 'react';
    
    function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(false);
    
      return (
        <div>
          <h1>Welcome!</h1>
          {isLoggedIn && <p>You are logged in!</p>}
        </div>
      );
    }
    
    export default App;
    ```
    
- You can also use a `switch` statement when you have multiple conditions to check.
    
    ```jsx
    import React, { useState } from 'react';
    
    function App() {
      const [userRole, setUserRole] = useState('guest');
    
      let content;
      switch (userRole) {
        case 'admin':
          content = <h1>Admin Dashboard</h1>;
          break;
        case 'member':
          content = <h1>Member Area</h1>;
          break;
        default:
          content = <h1>Welcome, Guest!</h1>;
      }
    
      return (
        <div>
          {content}
        </div>
      );
    }
    
    export default App;
    ```
    

---

# What is axios? What have you used it for?

- **Axios** is a promise-based HTTP client for the browser and Node.js, commonly used to make HTTP requests in JavaScript applications.
    - It simplifies the process of sending requests and handling responses and provides several powerful features like automatic JSON parsing, request and response interceptors, and error handling.
    - Axios is widely used in frontend frameworks like React for communicating with APIs.
- **Key Features of Axios:**
    - **Promise-based**: Uses promises for asynchronous requests, allowing you to use `.then()`, `.catch()`, and `.finally()` for handling the response and errors.
    - **Automatic JSON Parsing**: Automatically parses the JSON response from the server, eliminating the need to manually call `.json()` like you would with `fetch`.
    - **Request/Response Interceptors**: You can modify requests before they are sent and responses before they are processed.
    - **Error Handling**: Provides detailed error information, including the response, request, and error message.
    - **Cancel Requests**: Allows you to cancel requests if they are no longer needed (e.g., when a component unmounts).
    - **Timeouts**: You can configure timeouts to limit how long a request can take before being considered a failure.
    - **Concurrency**: Makes it easy to handle multiple requests at the same time using `Axios.all()`.
- **What I've Used Axios For:**
    1. **Making API requests**: To fetch data from an API or send data to an API in a React app.
    2. **Handling authentication**: Sending tokens in headers for authorization when accessing protected routes.
    3. **Form submission**: Sending form data as JSON to the server for processing.
    4. **Error handling**: Managing and displaying detailed errors from API calls, such as network errors or validation failures.
    5. **Optimizing performance**: Using Axios to handle multiple requests concurrently and cancel unnecessary requests (e.g., for debouncing inputs or canceling a previous request when a new one is triggered).

---
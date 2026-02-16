# SwiftCart E-Commerce Project

A simple, dynamic, and responsive e-commerce platform built with Vanilla JavaScript and Tailwind CSS, utilizing the FakeStoreAPI for real-time data.

## 🚀 Live Link
[Click here to view the live site](https://ahmedmprince.github.io/SwiftCart/)

## 🛠️ Technology Stack
- **HTML5**
- **Tailwind CSS** (via CDN)
- **DaisyUI** (via CDN)
- **JavaScript** (Vanilla ES6+)

---

## ❓ Technical Q&A

### 1. What is the difference between `null` and `undefined`?
- **`undefined`**: This is a default value assigned by JavaScript when a variable is declared but no value has been assigned to it yet.
- **`null`**: This is an assignment value that represents the intentional absence of any value. A programmer assigns `null` to a variable to explicitly say it is "empty."

### 2. What is the use of the `map()` function in JavaScript? How is it different from `forEach()`?
- **`map()`**: It creates a **new array** by applying a function to every element of the original array. It is used when you want to transform data.
- **`forEach()`**: It is used to execute a function for each element in an array but it **does not return anything** (returns `undefined`). It is used for side effects like logging or updating the DOM.

### 3. What is the difference between `==` and `===`?
- **`==` (Loose Equality)**: It compares only the values. It performs type conversion (coercion) before comparing. Example: `5 == "5"` is `true`.
- **`===` (Strict Equality)**: It compares both the value and the data type. No type conversion is done. Example: `5 === "5"` is `false`.

### 4. What is the significance of `async/await` in fetching API data?
`async/await` makes working with asynchronous code (like fetching data from a server) much easier. It tells JavaScript to pause execution until the API request is finished, ensuring that we have the data before trying to use it. This prevents errors and makes the code look cleaner than using `.then()` chains.

### 5. Explain the concept of Scope in JavaScript (Global, Function, Block).
Scope determines where a variable is accessible:
- **Global Scope**: Variables declared outside any function or block can be accessed from anywhere.
- **Function Scope**: Variables declared inside a function are only accessible within that function.
- **Block Scope**: Variables declared with `let` or `const` inside `{ }` (like `if` or `for` loops) are only accessible within those brackets.

---

## 🎯 Features & Functionalities
- **Dynamic Categories**: Categories are fetched and displayed as interactive filter buttons.
- **Real-time Product Loading**: Products change dynamically based on the selected category.
- **Interactive Modals**: Clicking "Details" opens a modal with complete product information.
- **Cart Interaction**: A functional "Add to Cart" button that updates the cart count in the navbar.
- **Loading State**: Includes a spinner to improve UX while data is being fetched.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.

---

## ⚙️ Installation & Setup
1. Clone the repository.
2. Open `index.html` in your browser (use VS Code "Live Server" for the best experience).
3. Ensure you have an active internet connection to load the Tailwind and DaisyUI CDNs.
# React Gemeni Tryout

This project is a React-based e-commerce application integrated with Google's Gemini model. It also includes a mock backend API using `json-server` to simulate product data.

## Setup Instructions

Follow the steps below to set up the project locally and run the server and e-commerce application simultaneously.

### 1. Install Dependencies

First, make sure you have all the necessary dependencies installed. In the project root directory, run:

```bash
npm install
```

This will install both the development dependencies (`concurrently`, `tailwindcss`) and regular dependencies (React, etc.).

### 2. Start the Server and E-commerce App

To start both the `json-server` (mock API) and the React e-commerce app at the same time, run the following command:

```bash
npm start
```

This will:

- Start the `json-server` on [http://localhost:5000](http://localhost:5000) to serve the mock product data.
- Start the React app on [http://localhost:3000](http://localhost:3000).

Both processes will run simultaneously using `concurrently`.

### 3. Open the Application

After running the above command, open the following URLs in your browser:

- **E-commerce React App**: [http://localhost:3000](http://localhost:3000)
- **JSON Server (Mock API)**: [http://localhost:5000](http://localhost:5000)

You can now interact with the e-commerce app and see how the chatbot responds to queries about products.

### 4. Stopping the Server

To stop both the server and the e-commerce app, simply press `CTRL + C` in the terminal where they are running.

---

## Project Structure

- **`src/`**: Contains all source code for the React app.
  - **`data/`**: Contains the `db.json` file used by `json-server` to simulate the backend.
  - **`components/`**: React components such as `ChatbotModal`, `Loading`, etc.

- **`package.json`**: The configuration file for dependencies and scripts.

---

## Troubleshooting

- If you face issues with the server or app not starting, ensure you have Node.js installed and the correct versions for the dependencies.
  
- If you receive any errors related to `json-server` or React, try clearing the node modules cache by running:

  ```bash
  rm -rf node_modules
  npm install
  ```

---

## Contributing

Feel free to fork the repository and submit pull requests for improvements. For issues or bugs, please open an issue in the GitHub repository.

---

## License

This project is licensed under the MIT License.
```

This is the full file, and now it should be ready to be copied and pasted directly into your `README.md`.
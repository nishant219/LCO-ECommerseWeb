# LCO-ECommerce Backend🚀 
 Node.js/Express/MongoDB  <br />
This is the backend for an eCommerce project built with Node.js and Express. It provides API endpoints for user authentication, product management, and payment processing and many more features.


## Getting Started

To get started with this project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Configure environment variables: Create a `.env` file and set the required environment variables (e.g., database connection details, authentication secrets, and API keys).
4. Start the server: `npm start`

## Project Structure

`Server`: 
- `Config`: Manages the database connection.
- `Controllers`: Handles request handling and business logic.
- `Models`: Defines data models/schema for the database.
- `Middlewares`: Implements middleware functions for request handling.
- `Routes`: Defines API routes for the application.
- `utils`: Houses utility functions and helper modules.
- `passport`: To handle social signup/signin.

<br />

* Files in the root of project  <br />
app.js and index.js- This file would basically be the entry point of the Express application. <br />
package.json- file which contains all the project npm details, scripts and dependencies. <br />
.gitignore- The files you don’t want to push to git <br />
.env - to store passwords and other keys <br />

-----------------------------------------------------------------------------------------------

## User Routes

The user routes handle user registration, login, and management. The following routes are available:

- `/signup`: Register a new user.
- `/login`: Log in a user.
- `/logout`: Log out the currently logged-in user.
- `/forgotPassword`: Request a password reset.
- `/password/reset/:token`: Reset the password using a token.
- `/userdashboard`: Get the details of the currently logged-in user.
- `/password/update`: Update the user's password.
- `/userdashboard/update`: Update the user's details.

## Authentication

Authentication is implemented using Passport.js for user authentication. The project supports Google OAuth2 for user login.

- `/auth/google`: Initiate Google OAuth2 authentication.
- `/auth/google/callback`: Handle the Google OAuth2 callback and provide user details.


### Admin and Manager Routes

These routes are accessible only to users with specific roles (admin or manager):

- `/admin/users`: Get a list of all users (admin role required).
- `/admin/user/:id`: Get, update, or delete a specific user (admin role required).

### Admin Routes for products

Admin-specific routes are used for managing products and are accessible only to users with the admin role:

- `/admin/product/add`: Add a new product (admin role required).
- `/admin/products`: Get a list of all products (admin role required).
- `/admin/product/:id`: Update or delete a specific product (admin role required).



## Product Routes

Product management routes handle adding, updating, and deleting products, as well as managing product reviews. The available routes are:

- `/products`: Get a list of all products.
- `/product/:id`: Get details of a specific product.
- `/review`: Add a product review.
- `/review`: Delete a product review.
- `/reviews`: Get reviews for a specific product.


## Payment Routes

Payment processing is integrated into the application using Stripe and Razorpay. Payment routes include:

- `/stripeKey`: Get the Stripe API key.
- `/stripePayment`: Capture a payment using Stripe.
- `/razorpayKey`: Get the Razorpay API key.
- `/razorpayPayment`: Capture a payment using Razorpay.

## Future/Upcoming Features

This project has plans for adding more features in the future:

- Product checkout and order placing.
- Product review functionality.
- Product wishlisting feature.
- Comments feature.

Feel free to contribute or stay tuned for updates as these features are implemented.


## Contributing

Contributions to the repo are welcome! Please follow these steps:

1. 🍴 Fork the repository.
2. 🌿 Create a new branch for your feature or fix.
3. 🛠️ Make your changes and commit them.
4. 🚀 Push your changes to your fork.
5. 🔄 Create a pull request to the main repository.

Contributions and feedback are welcome! If you find any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue. Please follow the contribution guidelines.

👨‍💻 **Author**: Nishant (@nishant219)

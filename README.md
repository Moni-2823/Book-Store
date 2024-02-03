# Book Store Backend

## Overview

This project is a backend implementation for a book store application. It includes features such as user management, book management, purchase history, revenue tracking for authors, and more.

## Logic for Computing `sellCount`

The `sellCount` for a book is computed based on the purchase history. It is an aggregated count of the number of times a book has been purchased. The logic involves summing up the `quantity` field in the `PurchaseHistory` collection for a specific book. This ensures that `sellCount` accurately represents the total number of copies sold for each book.

## Mechanism for Sending Email Notifications

The email notification mechanism is implemented using a background job or message queue to handle emails asynchronously. Whenever a purchase is recorded in the `PurchaseHistory` collection, an email notification is triggered to notify the author. The notification includes details such as the current month, current year, and total revenue. The asynchronous processing ensures that sending emails does not block the main application thread, providing a more responsive user experience.

## Database Design and Implementation

### Users

- The `Users` collection includes different roles such as Author, Admin, and Retail Users. User authentication and authorization are implemented to ensure secure access to various endpoints.

### Books

- The `Books` collection stores book details, including a unique `bookId`, authors, `sellCount`, title, description, and price. A unique index is set on `bookId` and `title` to enforce uniqueness.

### Purchase History

- The `PurchaseHistory` collection records each book purchase, including a unique `purchaseId`, `bookId`, `userId`, `purchaseDate`, `price`, and `quantity`. A unique index is set on `purchaseId` to ensure uniqueness.

### Revenue Tracking for Authors

- The `sellCount` is used to track the number of book copies sold. The revenue for authors is calculated based on the total sales of their books.

### Additional Features

- The application supports search and filtering options for books based on various criteria, such as author, price range, and sellCount.

- Secure payment processing using Stripe is implemented for book purchases.

- Users can review and rate books, with reviews stored in the `Review` collection.

## Installation and Usage

To run the application locally:

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up a MongoDB database and configure the connection in the `.env` file.
4. Obtain Stripe API keys and set them in the `.env` file.
5. Run the application with `npm start`.

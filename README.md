🏠 WonderLust— Full-Stack House Rental Platform
A full-stack web application built using Node.js, Express, MongoDB, and Cloudinary, with EJS for server-side rendered views. It supports complete CRUD operations, user authentication, authorization, image uploads, review and rating features, and location-based listings.
Only the user who listed a property can edit or delete it. Reviews can also be added and managed with ownership checks. Images are uploaded to Cloudinary, and data is stored in MongoDB. The project follows MVC architecture and is currently deployed on Render.

⚠️ Note: Cloning the project may require environment variable configuration and adjustments due to deployment-specific code updates for Render.

### 🚀 Features
- 🔐 User Authentication & Authorization (login/signup + access control)
- 🏡 Add, Edit, Delete House Listings
- 🌄 Image Uploads using **Cloudinary**
- 📝 Add/Delete/Edit Reviews (with ownership checks)
- 🧰 Error Handling (client-side + server-side)
- 🧪 Basic Routing & Middleware structure
- 📦 Follows MVC architecture

---

### 🛠️ Tech Stack

| Area        | Technology        |
|-------------|-------------------|
| Backend     | Node.js, Express  |
| Database    | MongoDB, Mongoose |
| Auth        | JWT, Bcrypt       |
| Image Upload| Cloudinary        |
| Views       | EJS               |
| Styling     | CSS               |

📚 Future Improvements
 Pagination for house listings
 Add booking functionality
 Admin dashboard
 Frontend (React) integration

## 📚 Future Improvements

- 🔍 Location-based Search
  Allow users to search listings by city, state, or pin code.

- 🧭 Advanced Search Filters  
  Add filters for price, rating, house type, availability, and sort options (e.g., newest, lowest price).

- 📑 Pagination for Listings  
  Implement pagination to display listings page by page for performance and cleaner UX.

- 📅 Booking Functionality  
  Enable users to book houses for specific dates, with availability checks and a booking model.

- 💳 Payment Integration  
  Integrate Razorpay or Stripe to securely handle booking payments.

- 📤 mail Notifications  
  Send confirmation emails on signup, booking, and listing status.

- 🧑‍💼 Admin Dashboard  
  Create admin-only access to manage users, listings, and reviews.

- 🌐 Frontend Upgrade to React  
  Rebuild the frontend as a modern SPA using React and integrate with backend via REST APIs.

- 📱Mobile Responsiveness & PWA Support  
  Improve UI/UX on mobile devices and enable offline functionality.

- 📦 Image Compression & Validation
  Add Multer middleware for image size/type checks and optimize Cloudinary usage.

  ## 💡 Author

Made with ❤️ by **Sumanth Kulal**

- 💼 LinkedIn: www.linkedin.com/in/sumanth-kulal
- 📧 Email: sumanthkulal2005@gmail.com

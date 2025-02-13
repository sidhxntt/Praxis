
# Welcome to **CodeRush** 🚀

### 🚀 **Launch Steps**:

1. **Update the `.env` file**  
   Ensure all environment variables are configured properly for your project. Also update dockerfile & docker-compose.yml accordingly

2. **Seed the database & sync with Prisma**  
   Run the command specified in the `package.json` to seed sample data and sync it with Prisma client.

3. **Run the Docker Command**  
   Execute `npm run dockerise` to start your backend. 🙌 (By default it runs on port 8000)

---

### 🗺️ **ER Diagram**:

![ER Diagram](./public/ER.png)

### 🔄 **Application Logic Diagram**:

![Logic](./public/Logic.png)

---

### 🗂️ **Folder Structure**:

- **`Controllers/`**:  
  Contains middlewares for authorization, authentication, error handling, and rate limiting.

- **`Routes/`**:  
  Houses both main routes and subroutes for your application.

- **`Utils/`**:  
  Includes utility client connections to diffrent serivces and helper function to perfrom CRUD operations.

---

> **Note**:  
> Worker functions should ideally run independently of the server. For production environments, ensure that they run on a separate server. For development purposes, these functions run as a different process managed by PM2.

> User and it's address needs to be created together as user cannot be created without adding it's address and vice-versa.

---

### ✨ **Customization**:

This starter template is designed for a quick headstart. Feel free to modify and enhance it to suit your needs.  
Happy coding! 🚀

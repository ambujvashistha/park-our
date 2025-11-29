# ParkEase - Smart Parking Management System

A comprehensive parking lot status and management application for commercial complexes, built with React Native (Expo) and Node.js.

## Overview

ParkEase helps commercial complexes monitor and share the occupancy status of their parking lots in real-time. The system provides separate interfaces for administrators to manage parking slots and visitors to find available parking. It features a robust backend API and a cross-platform mobile application.

## Features

### Authentication
- Secure Admin Login & Signup
- JWT-based session management

### Admin Features
- **Dashboard**: Real-time overview of all parking slots.
- **Slot Management**: Create, update, and delete parking slots.
- **Status Control**: Mark slots as Free, Occupied, or Reserved.
- **Logs**: View historical activity for each slot.
- **Types**: Support for Two-wheeler and Four-wheeler slots.

### Visitor Features
- **Live Status**: View real-time availability of parking slots.
- **Visual Grid**: Interactive grid view of the parking lot.
- **Recommendations**: Smart suggestion for the nearest available slot.
- **Auto-Refresh**: Data updates automatically every 10 seconds.

### Analytics
- **Utilization**: Real-time occupancy percentage.
- **Breakdown**: Detailed stats by vehicle type.
- **Insights**: Visual progress indicators and trends.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **API**: RESTful JSON endpoints

### Mobile App
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack)
- **Networking**: Axios
- **Styling**: Custom Design System with Linear Gradients
- **Maps**: React Native Maps integration

## Getting Started

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory with the following content:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/parkease
    JWT_SECRET=your_super_secret_key_here
    ```

4.  **Seed Database (Optional):**
    Initialize the database with default slots and an admin user.
    ```bash
    npm run seed
    ```

5.  **Start the Server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

### Mobile App Setup

1.  **Navigate to the mobile directory:**
    ```bash
    cd mobile
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API Endpoint:**
    Open `src/config/api.js` and update the `API_BASE_URL` with your computer's local IP address.
    > **Note:** Do not use `localhost` if testing on a physical device. Use your machine's LAN IP (e.g., `192.168.1.x`).
    ```javascript
    const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000/api';
    ```

4.  **Start Expo:**
    ```bash
    npx expo start
    ```

5.  **Run on Device:**
    - **Physical Device:** Scan the QR code using the **Expo Go** app (Android) or Camera app (iOS).
    - **Simulator:** Press `a` for Android Emulator or `i` for iOS Simulator.



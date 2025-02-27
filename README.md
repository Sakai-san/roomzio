# ROOMZ Frontend Test React

This project was bootstrapped with [Vite](https://vite.dev/guide/) and runs on [node v22](https://nodejs.org/en/download).

## Instructions

You will have to design and implement a React app that resolves the **User Story** described below. By the way, you should use semantic HTML and follow best practices to create a responsive UI.

This assignment is to assess your skills in fetching and manipulating data, as well as implementing a simple UI in React, HTML, and CSS. You should also handle loading and error states effectively.

- There is no time limit. Focus on creating clean and well-structured code.
- There's no design provided.

## User Story

As a user of the ROOMZ application, I want to seamlessly manage room bookings through an intuitive React interface, ensuring I can efficiently organize and access meeting spaces and their associated devices.

### Acceptance criteria

- **Room list display** : I want to view a list of all available rooms, each showing the room's name and booking status. This allows me to quickly assess which rooms are available for booking.
- **Room details** : By selecting a room, I can view detailed information including the room's name, current booking status, a list of linked devices, and booking details if applicable. If a room is booked, I want to see the organizer's full name and avatar to identify who has reserved the space.
- **Device information** : For each device linked to a room, I need a direct link to its details. The device details should include the device's name, type, and remaining battery percentage, helping me ensure the equipment is ready for use.
- **Booking management** : I want the ability to book a room if it is free or release it if it is currently booked. This functionality should handle errors gracefully if a room's status changes unexpectedly.

## Getting started

In the project folder, run the following commands:

```
npm install
```

```
npm start
```

This will run the app on http://localhost:3001 and the API on http://localhost:3000.

### Endpoints

| Endpoints                       | Description                                                                 |
| ------------------------------- | --------------------------------------------------------------------------- |
| **GET /rooms**                  | Lists all rooms with basic details (name, booking status).                  |
| **GET /rooms/:roomId**          | Retrieves detailed information about a specific room, including devices.    |
| **GET /devices/:deviceId**      | Retrieves details of a specific device linked to a room, including battery. |
| **POST /rooms/:roomId/book**    | Books a room if it is free; returns an error if already booked.             |
| **POST /rooms/:roomId/release** | Releases a room if it is booked; returns an error if already free.          |

### Models

| Models      | Property | Type     | Description                                         |
| ----------- | -------- | -------- | --------------------------------------------------- |
| **Room**    | id       | string   | Unique identifier for the room.                     |
|             | name     | string   | Name of the room.                                   |
|             | booking  | Booking? | Optional booking details for the room (if booked).  |
|             | devices  | Device[] | List of devices linked to the room.                 |
| **Device**  | id       | string   | Unique identifier for the device.                   |
|             | name     | string   | Name of the device.                                 |
|             | type     | string   | Type of the device (e.g., Display).                 |
|             | battery  | number   | Battery percentage of the device.                   |
| **Booking** | fullName | string   | Full name of the person who booked the room.        |
|             | avatar   | string   | Avatar image URL of the person who booked the room. |

## Feedback from candidate

First off, thanks for the challenge. I do appreciate these hands-on a lot over academic questions.

All requirements have been implemented.

From the choosen technologies point of view, I went for the [TanStack](https://tanstack.com/). Indeed the provided skeleton is built by Vite, which means a **client-side** routing system was needed.
From the UI perspective, I opt for [MUI](https://mui.com/material-ui/), since with it you can ship a prototype quickly.

Features that I wanted to implement - time was a missing:

- `breadcrumb`
- home page using `on demand rendering` [with react-window](https://github.com/bvaughn/react-window)
- `split up` the code to more specialized components and custom hooks
- `tooltip` on action icons (booking and releasing)
- improve the `A11y`

---
title: "HTTP"
order: 5
lang: "bash"
---

# What is HTTP?

- **HTTP (HyperText Transfer Protocol)** is the backbone of internet communication, enabling data exchange between clients and servers.

## HTTP Request

- **Method/Verb**: Specifies the action (e.g., `GET`, `POST`, `PUT`).
- **URL**: The endpoint or resource location.
- **Header**: Metadata about the request.

```bash
Authorization: Bearer <token>
Content-Type: application/json
```

- **Body**: Data sent to the server (used with POST/PUT).

```json
{
    "name": "John Doe",
    "email": "john.doe@example.com"
}
```

## HTTP Response

- **Status Code**: Indicates the result of the request (200 OK, 404 Not Found, 500 Server Error).
- **Header**: Metadata about the response.
- **Body**: Contains the response data or error message.

# What is an API?

- An **API (Application Programming Interface)** is a set of rules and protocols that allow different software applications to communicate.
- **Types**:
    - **Web APIs**: Use HTTP (REST, SOAP) for client-server communication.
    - **Library APIs**: Allow integration of third-party libraries.
- **Uses**: Accessing data/services, integrating systems.

# What is a "REST API"?

- **REST** (REpresentational State Transfer) is an architectural style for building web services.
- **Resources**: Data or entities uniquely identified by a URI.
- REST relies on specific **HTTP methods** to perform actions on resources: GET, POST, PUT, PATCH, DELETE.

# What are HTTP verbs?

- **GET**: Retrieve information. Safe, idempotent, empty body.
    - Example: `GET /users` retrieves all users.
- **POST**: Create a new resource. Data in request body, not idempotent.
    - Example: `POST /users` adds a new user.
- **PUT**: Update an entire resource. Replaces all data, idempotent.
    - Example: `PUT /users/1` replaces all data for user 1.
- **PATCH**: Update specific fields. Partial updates, idempotent.
    - Example: `PATCH /users/1` updates specific attributes.
- **DELETE**: Remove a resource. Idempotent.
    - Example: `DELETE /users/1` deletes user 1.

# What are HTTP status codes?

## 1xx: Informational

- **101 Switching Protocols**: Server switches protocols (e.g., HTTP to WebSocket).

## 2xx: Success

- **200 OK**: Request succeeded.
- **201 Created**: Resource created successfully.
- **202 Accepted**: Request accepted, processing asynchronously.
- **204 No Content**: Request succeeded, no content returned.

## 3xx: Redirects

- **301 Moved Permanently**: Resource has a new permanent URL.
- **302 Found**: Temporary redirection.
- **307 Temporary Redirect**: Temporary redirection, same method used.

## 4xx: Client Errors

- **400 Bad Request**: Malformed or invalid request.
- **401 Unauthorized**: Missing or invalid authentication.
- **403 Forbidden**: Authenticated but lacks permission.
- **404 Not Found**: Requested resource not found.

## 5xx: Server Errors

- **500 Internal Server Error**: Generic server issue.
- **501 Not Implemented**: Functionality not supported.
- **502 Bad Gateway**: Invalid response from a gateway or proxy.
- **504 Gateway Timeout**: Gateway or proxy timed out.

# What is Postman used for?

- Postman is a tool for testing and debugging HTTP requests to servers.
- **Making HTTP Requests**: Send GET, POST, PUT, DELETE with headers, body, and auth.
- **Testing Servers**: Test endpoints before building a frontend.
- **Troubleshooting**: If request fails from frontend but succeeds in Postman → frontend issue. If fails in Postman too → backend issue.

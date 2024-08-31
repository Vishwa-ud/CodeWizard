const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

// Create an instance of Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(morgan("combined")); // Log HTTP requests
app.disable("x-powered-by"); // Hide Express server information

// Define routes and corresponding microservices
const services = [
  {
    //all services endpoints
    
    route: "/test",
    target: `${process.env.SERVICE_NAME_CA}/test-ag`,
    headers: {
      "x-api-key": "apikey",
    },
  },
  {
    //all services endpoints
    
    route: "/generate-flowchart",
    target: `${process.env.SERVICE_NAME_CA}/generate-flowchart-ag`,
    headers: {
      "x-api-key": "apikey",
    },
  },
  // ... Add more services here ...
];

// Middleware function for setting headers
function setHeaders(req, res, next) {
  const route = req.originalUrl.split("/")[1]; // Get route from URL
  const service = services.find((s) => s.route === `/${route}`);

  if (service && service.headers) {
    // Set headers if defined for the route
    Object.entries(service.headers).forEach(([key, value]) => {
      req.headers[key] = value;
    });
  }

  next();
}

// Apply the setHeaders middleware to all routes
app.use(setHeaders);

// Set up proxy middleware for each microservice
try {
  services.forEach(({ route, target }) => {
    // Proxy options
    const proxyOptions = {
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${route}`]: "",
      },
    };

    console.log(`Proxying ${route} to ${target}`);

    // Apply proxy middleware
    app.use(route, createProxyMiddleware(proxyOptions));
  });
} catch (err) {
  console.log(err);
}

// Handler for route-not-found
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Route not found.",
    data: null,
  });
});

// Define port for Express server
const PORT = process.env.PORT || 5000;

// Start Express server
app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});

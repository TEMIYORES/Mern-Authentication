import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  optionsStatus: 200,
};

export default corsOptions;

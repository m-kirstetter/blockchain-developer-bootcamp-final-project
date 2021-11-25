import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import passport from 'passport';
import { errorConverter, errorHandler } from './middlewares/error';
import { AuthRoutes } from './routes/AuthRoutes';
import { UsersRoutes } from './routes/UsersRoutes';
import { GigsRoutes } from './routes/GigsRoutes';
import { ApplicationsRoutes } from './routes/ApplicationsRoutes';
import { jwtStrategy } from './config/passport';
import { ContractsRoutes } from './routes/ContractsRoutes';

const app = express();

mongoose.connect(process.env.NUXT_ENV_MONGODB_URL).then(() => {
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// gzip compression
app.use(compression({ threshold: 0 }));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

/**
 * routes to demonstrate the possibilities of vuesion
 * TODO: can be removed if you don't need them in your application
 */
AuthRoutes(app);
UsersRoutes(app);
GigsRoutes(app);
ApplicationsRoutes(app);
ContractsRoutes(app);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = {
  path: '/api/v1/',
  handler: app,
};

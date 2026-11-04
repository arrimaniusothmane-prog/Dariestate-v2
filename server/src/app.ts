import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { config } from './config/env.js';
import { prisma } from './config/prisma.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRouter from './modules/auth/auth.routes.js';
import propertiesRouter from './modules/properties/properties.routes.js';
import inquiriesRouter from './modules/inquiries/inquiries.routes.js';
import quotesRouter from './modules/quotes/quotes.routes.js';
import constructionRouter from './modules/construction/construction.routes.js';
import designRouter from './modules/design/design.routes.js';
import usersRouter from './modules/users/users.routes.js';
import settingsRouter from './modules/settings/settings.routes.js';
import mediaRouter from './modules/media/media.routes.js';
import reviewsRouter from './modules/reviews/reviews.routes.js';
import favoritesRouter from './modules/favorites/favorites.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // CORS
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || config.corsOrigin.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local dev
      }
    },
    credentials: true,
  }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Reasonable limit per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Trop de requêtes, veuillez réessayer plus tard.' }
  });
  app.use('/api', limiter);

  // Logging & Parsers
  if (config.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads serving
  const uploadDir = path.resolve(process.cwd(), config.uploadDir);
  app.use('/uploads', express.static(uploadDir));

  // Health check
  app.get('/api/v1/health', async (req, res) => {
    let databaseStatus = 'DISCONNECTED';
    try {
      // Fast probe to verify if database server is responding
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1000)),
      ]);
      databaseStatus = 'CONNECTED';
    } catch {
      databaseStatus = 'DISCONNECTED';
    }

    res.json({
      status: 'UP',
      database: databaseStatus,
      timestamp: new Date().toISOString(),
      service: 'DAR & ATELIER REST API v1',
      environment: config.nodeEnv,
    });
  });

  // REST API Modules
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/properties', propertiesRouter);
  app.use('/api/v1/inquiries', inquiriesRouter);
  app.use('/api/v1/quotes', quotesRouter);
  app.use('/api/v1/construction-projects', constructionRouter);
  app.use('/api/v1/design-projects', designRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/settings', settingsRouter);
  app.use('/api/v1/media', mediaRouter);
  app.use('/api/v1/reviews', reviewsRouter);
  app.use('/api/v1/favorites', favoritesRouter);

  // Error Handler
  app.use(errorHandler);

  return app;
};

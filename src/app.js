const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression');
const cors = require('cors');
const logger = require('./config/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const permissionsRoutes = require('./routes/permissions');
const branchesRoutes = require('./routes/branches');
const brandsRoutes = require('./routes/brands');
const categoriesRoutes = require('./routes/categories');
const colorsRoutes = require('./routes/colors');
const sizesRoutes = require('./routes/sizes');
const productsRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const importRoutes = require('./routes/imports');
const transferRoutes = require('./routes/transfers');
const notificationRoutes = require('./routes/notifications');
const centralRoutes = require('./routes/central');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('combined', { stream: logger.stream }));

// Build session store: use Redis when available, fall back to in-memory store.
let sessionStore;
if (process.env.REDIS_URL) {
  try {
    const RedisStore = require('connect-redis')(session);
    const Redis = require('ioredis');
    const redisClient = new Redis(process.env.REDIS_URL);
    redisClient.on('error', (err) => logger.warn('Redis error', err));
    redisClient.on('connect', () => logger.info('Connected to Redis'));
    redisClient.on('ready', () => logger.info('Redis ready'));
    sessionStore = new RedisStore({ client: redisClient });
    logger.info('Session store: Redis');
  } catch (err) {
    logger.warn('Failed to initialise Redis session store, falling back to in-memory store', err);
    sessionStore = undefined; // express-session defaults to MemoryStore
  }
} else {
  logger.warn('REDIS_URL not set — using in-memory session store (not suitable for production)');
  sessionStore = undefined; // express-session defaults to MemoryStore
}

app.use(
  session({
    ...(sessionStore ? { store: sessionStore } : {}),
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 8 }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/branches', branchesRoutes);
app.use('/brands', brandsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/colors', colorsRoutes);
app.use('/sizes', sizesRoutes);
app.use('/products', productsRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/imports', importRoutes);
app.use('/transfers', transferRoutes);
app.use('/notifications', notificationRoutes);
app.use('/central', centralRoutes);
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/permissions', permissionsRoutes);
app.get('/health', (req, res) => res.json({ ok: true }));
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) return res.render('errors/404');
  if (req.accepts('json')) return res.json({ error: 'Not found' });
  res.type('txt').send('Not found');
});
app.use(errorHandler);

module.exports = app;

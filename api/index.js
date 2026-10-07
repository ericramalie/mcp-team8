import { Router } from 'express';
import healthRouter from './health.js';
import uraRouter from './ura.js';
import onemapRouter from './onemap.js';
import hdbRouter from './hdb.js';
import realtimeRouter from './realtime.js';
import masRouter from './mas.js';

const apiRouter = Router();

// Root route list
apiRouter.get('/', (req, res) => {
  res.json({
    name: 'EstatePulse SG API Gateway',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      ura: {
        token: '/api/ura/token',
        transactions: '/api/ura/transactions?batch=1',
        carparks: '/api/ura/carparks',
        carparkDetails: '/api/ura/carpark-details',
      },
      onemap: {
        token: 'POST /api/onemap/token',
        search: '/api/onemap/search?searchVal=raffles%20place',
        revgeocode: '/api/onemap/revgeocode?location=1.3,103.8',
        route: '/api/onemap/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk',
      },
      hdb: {
        resale: '/api/hdb/resale?limit=5',
        resaleFiltered: '/api/hdb/resale?town=TAMPINES&flat_type=4%20ROOM&limit=5',
        metadata: '/api/hdb/metadata',
      },
      realtime: {
        weather: '/api/realtime/weather/two-hr-forecast',
        carparkAvailability: '/api/realtime/carpark-availability',
        taxiAvailability: '/api/realtime/taxi-availability',
      },
      mas: {
        exchangeRates: '/api/mas/exchange-rates',
        interestRatesSora: '/api/mas/interest-rates',
      },
    },
  });
});

apiRouter.use('/health', healthRouter);
apiRouter.use('/ura', uraRouter);
apiRouter.use('/onemap', onemapRouter);
apiRouter.use('/hdb', hdbRouter);
apiRouter.use('/realtime', realtimeRouter);
apiRouter.use('/mas', masRouter);

export default apiRouter;

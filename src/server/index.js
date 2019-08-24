///////////////////////////////////////////////////////////////////////////////////////////////////
/***************************************Dependencies**********************************************/
import express from 'express';
import open from 'open';
import path from 'path';
import morgan from 'morgan';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import {ApolloServer} from 'apollo-server-express';
import firebase from 'firebase-admin';
import cloudinary from 'cloudinary';
import logger from './logger';

///////////////////////////////////////////////////////////////////////////////////////////////////
/*****************************************Middlewares**********************************************/
import {isAuth} from './middlewares';

/*****************************************GraphQL Options**********************************************/
import {resolvers, typeDefs} from './graphql';

/********************************************Utils*************************************************/
import {isMobile, isBot} from '../shared/utils/device';

/***********************************Webpack Configuration******************************************/
import webpackConfig from '../../webpack.config';

/****************************************Client Render*********************************************/
import clientRender from './clientRender';

/************************************Server Configuration******************************************/
import serverConfig from './config';

/*******************************************Models*************************************************/

/********************************************API**************************************************/
import api from './api';

/****************************************Controllers**********************************************/
import {deleteProducts, getProduct, getProducts, saveProduct, updateProducts} from './controllers/products';
import {signIn, signInWithGoogle, signUp} from './controllers/user';

/******************************************Firebase************************************************/
firebase.initializeApp(serverConfig.firebase);

/*****************************************Cloudinary***********************************************/
cloudinary.v2.config(serverConfig.cloudinary);

///////////////////////////////////////////////////////////////////////////////////////////////////
/*****************************************Environment*********************************************/
const isDevelopment = process.env.NODE_ENV !== 'production';
const isOpenBrowser = process.env.OPEN_BROWSER === 'true';

/*******************************************Analyzer**********************************************/
const isAnalyzer = process.env.ANALYZER === 'true';

/*****************************************Express app*********************************************/
const app = express();

/******************************************Compiler**********************************************/
const compiler = webpack(webpackConfig);

/********************************************Port************************************************/
const port = process.env.NODE_PORT || 3000;

/***************************************Apollo Server*******************************************/
const apolloServer = new ApolloServer({typeDefs, resolvers});

apolloServer.applyMiddleware({app});

///////////////////////////////////////////////////////////////////////////////////////////////////
/****************************GZip Compression just for Production********************************/
if (!isDevelopment) {
  app.get('*.js', (req, res, next) => {
    req.url = `${req.url}.gz`;
    res.set('Content-Encoding', 'gzip');

    next();
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/****************************************Public static********************************************/
app.use(express.static(path.join(__dirname, '../../public')));

/*****************************************Body Parser********************************************/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

/***********************************parse application/json***************************************/
app.use(bodyParser.json());

/****************************************Morgan Logger********************************************/
app.use(morgan('combined'));

/**************************************Device Detection******************************************/
app.use((req, res, next) => {
  req.isBot = isBot(req.headers['user-agent']);
  req.isMobile = isMobile(req.headers['user-agent']);

  return next();
});

/***************************************API Middleware*******************************************/
app.use('/api', api);

///////////////////////////////////////////////////////////////////////////////////////////////////
/****************************************HTTP Methods********************************************/

//  Initial
app.use('/', (req, res, next) => {
  //  logger.info(`IN APP [IP: ${req.ip}] Han ingresado al sitio WEB`);
  //  console.info(`IN APP [IP: ${req.ip}] Han ingresado al sitio WEB`);
  return next();
});

//  Graphql
app.use('/graphql', graphqlHTTP(serverConfig.graphqlOptions));

//  Users
app.post('/signin', signIn);
app.post('/signin-with-google', signInWithGoogle);
app.post('/signup', signUp);

//  Products
app.get('/api/products', isAuth, getProducts);
app.get('/api/product/:productId', isAuth, getProduct);
app.post('/api/product', isAuth, saveProduct);
app.put('/api/product/:productId', isAuth, updateProducts);
app.delete('/api/product/:productId', isAuth, deleteProducts);

///////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************Hot Module Replacement***************************************/
if (isDevelopment) {
  app.use(webpackDevMiddleware(compiler));
  app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client')));
}

/***********************************Client Side Rendering***************************************/
app.use(clientRender());

if (!isDevelopment) {
  try {
    const serverRender = require('../../dist/server').default;

    app.use(serverRender());
  } catch (e) {
    throw e;
  }
}

/***********************For Server Side Rendering on Development Mode***************************/
app.use(webpackHotServerMiddleware(compiler));


///////////////////////////////////////////////////////////////////////////////////////////////////
/************************************Data Base Connection****************************************/
mongoose.connect(serverConfig.db, err => {
  if (err) {
    logger.info(`Error al conectar a la base de datos ${err}`);
    console.info(`Error al conectar a la base de datos ${err}`);
  } else {
    logger.info('Conexión a la Base de Datos establecida');
    console.info('Conexión a la Base de Datos establecida');
  }

  // Listening
  app.listen(port, err => {
    if (!err && !isAnalyzer) {
      const messages = {
        app: `
        ============================================================================================================================
        |·─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─·─··─··─·|
        |·· Aplicación corriendo en: ==>  http://localhost:${port}  <== Abrir enlace con (Ctrl + Clic) en Windows, Linux, MAC ·|
        |·─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─·─··─··─·|
        ============================================================================================================================
      `,
        graphql: `
        ============================================================================================================================
        |·─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─·─··─··─·|
        |· GraphQL Server corriendo en: ==>  http://localhost:${port}/graphql  <== Abrir enlace con (Ctrl + Clic) en Windows, Linux, MAC ·|
        |·─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─·─··─··─·|
        ============================================================================================================================
      `,
        apollo: `
        ============================================================================================================================
        |·─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─·─··─··─·|
        |· Apollo Server corriendo en: ==>   http://localhost:${port}/apollo${apolloServer.graphqlPath}  <== Abrir enlace con (Ctrl + Clic) en Windows, Linux, MAC ·|
        |·─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─··─·─··─··─·|
        ============================================================================================================================
        `
      };


      logger.info(messages.app);
      console.info(messages.app);

      logger.info(messages.graphql);
      console.info(messages.graphql);

      logger.info(messages.apollo);
      console.info(messages.apollo);

      if (isOpenBrowser) {
        open(`http://localhost:${port}`);
      }
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////

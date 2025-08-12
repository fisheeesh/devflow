//$ To establish MongoDB and Mongoose connection
import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';

import '@/database';

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined.');
}

interface MongooseCache {
    conn: Mongoose | null,
    promise: Promise<Mongoose> | null;
    lastHealthCheck: number;
}

/**
 * * This singleton pattern, which allows us to declare the connection once and 
 * * maintains that single instance of the connection improves the preformance and reliability
 * * Without caching, each invocation could create a new db connection,
 * * leading to resource exhaustiion and potential connection limits being reached.
 */
declare global {
    var mongoose: MongooseCache
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null, lastHealthCheck: 0 }
}

//* Check if existing connection is healthy
const isConnectionHealthy = (conn: Mongoose): boolean => {
    return conn.connection.readyState === 1 && conn.connection.db !== undefined
}

/**
 * * This is gonna be the simplest way to alwasy have access to our MongoDB
 * * without having to re-establish connection upon every server action call.
 */
const dbConnect = async (): Promise<Mongoose> => {
    //* Check if we have a healthy existing connection
    if (cached.conn && isConnectionHealthy(cached.conn)) {
        //* Perform occasional health check (every 5 minutes)
        const now = Date.now()
        if (now - cached.lastHealthCheck > 5 * 60 * 1000) {
            try {
                if (cached.conn.connection.db) {
                    await cached.conn.connection.db.admin().ping()
                    cached.lastHealthCheck = now
                    logger.info("Using existing healthy database connection")
                } else {
                    logger.warn("Database object is undefined during health check, reconnecting...")
                    cached.conn = null
                    cached.promise = null
                }
            } catch (error) {
                logger.warn("Health check failed, reconnecting...")
                cached.conn = null
                cached.promise = null
            }
        } else {
            logger.info("Using existing database connection")
        }

        if (cached.conn) return cached.conn
    }

    //* Clean up unhealthy connection
    if (cached.conn && !isConnectionHealthy(cached.conn)) {
        logger.warn("Existing connection is unhealthy, reconnecting...")
        cached.conn = null
        cached.promise = null
    }

    if (!cached.promise) {
        logger.info("Creating new MongoDB connection...")

        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "devflow",

            //* Connection pool settings
            maxPoolSize: 10,        // Maximum number of connections
            minPoolSize: 2,         // Minimum number of connections to maintain
            maxIdleTimeMS: 30000,   // Close connections after 30 seconds of inactivity

            //* Timeout settings - optimized for production
            serverSelectionTimeoutMS: 10000,  // 10 seconds to find a server
            socketTimeoutMS: 45000,           // 45 seconds for socket operations
            connectTimeoutMS: 15000,          // 15 seconds to establish initial connection

            //* Disable command buffering to fail fast
            bufferCommands: false,

            //* Connection monitoring
            heartbeatFrequencyMS: 10000,  // Check server every 10 seconds

            //* Retry settings
            retryWrites: true,
            retryReads: true,

            //* Performance optimizations
            compressors: ['zlib'],  // Enable compression

        }).then((mongooseInstance) => {
            logger.info("Successfully connected to MongoDB");

            //* Set up connection event listeners for better monitoring
            const connection = mongooseInstance.connection

            connection.on('error', (err) => {
                logger.error("MongoDB connection error:", err)
                cached.conn = null
                cached.promise = null
            })

            connection.on('disconnected', () => {
                logger.warn("MongoDB disconnected")
                cached.conn = null
                cached.promise = null
            })

            connection.on('reconnected', () => {
                logger.info("MongoDB reconnected")
                cached.lastHealthCheck = Date.now()
            })

            connection.on('close', () => {
                logger.warn("MongoDB connection closed")
                cached.conn = null
                cached.promise = null
            })

            //* Set initial health check timestamp
            cached.lastHealthCheck = Date.now()

            return mongooseInstance;
        }).catch((err) => {
            //* Reset promise so next request can retry
            cached.promise = null;

            //* Provide more specific error messages
            let errorMessage = "Database connection failed"
            if (err.message.includes('timeout')) {
                errorMessage = "Database connection timed out - server may be busy"
            } else if (err.message.includes('authentication')) {
                errorMessage = "Database authentication failed - check credentials"
            } else if (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
                errorMessage = "Cannot reach database server - check connection string and network"
            }

            logger.error("Error connecting to MongoDB:", err);
            throw new Error(`${errorMessage}: ${err.message}`);
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        //* Reset both conn and promise on failure so next request can retry
        cached.conn = null
        cached.promise = null
        throw error
    }
}

export default dbConnect
/* eslint-disable no-var */
//$ To establish MongoDB and Mongoose connection
import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined.');
}

interface MongooseCache {
    conn: Mongoose | null,
    promise: Promise<Mongoose> | null;
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
    cached = global.mongoose = { conn: null, promise: null }
}

/**
 * * This is gonna be the simplest way to alwasy have access to our MongoDB
 * * without having to re-establish connection upon every server action call.
 */
const dbConnect = async (): Promise<Mongoose> => {
    if (cached.conn) {
        logger.info("Using existing database connection")
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                dbName: 'devflow'
            })
            .then(res => {
                logger.info("Connected to MongoDB")
                return res
            })
            .catch(err => {
                logger.error("Error connecting to MongoDB", err)
                throw err
            })
    }

    cached.conn = await cached.promise

    return cached.conn
}

export default dbConnect
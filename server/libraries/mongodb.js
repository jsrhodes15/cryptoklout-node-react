/**
 * DON'T USE THIS YET, CHANGES NEED TO BE MADE
 */

const MongoClient = require("mongodb").MongoClient;
const config = require("../../config");

/**
 * Find all documents for a given collection
 * @param {string} collection - Name of the collection
 * @param {object} query - Query to execute against collection
 * @param {object} options - Options to apply against query
 * @return {object} - result from mongo
 */
async function findAll(collection, query = {}, options = {}) {
  const db = await MongoClient.connect(config.mongoDbUri);
  try {
    return await db
      .collection(collection)
      .find(query, options)
      .toArray();
  } finally {
    db.close();
  }
}

/**
 * Executes an aggregate query
 * @param {string} collection - Name of the collection
 * @param {array} query - Query to execute against collection
 * @return {object} - result from mongo
 */
async function aggregate(collection, query) {
  const db = await MongoClient.connect(config.mongoDbUri);
  try {
    const col = db.collection(collection);
    return await col.aggregate(query).toArray();
  } finally {
    db.close();
  }
}

/**
 * Find one document
 * @param {string} collection - Name of the collection
 * @param {object} query - Query to execute against collection
 * @return {object} - result from mongo
 */
async function findOne(collection, query) {
  const db = await MongoClient.connect(config.mongoDbUri);
  try {
    return await db.collection(collection).findOne(query);
  } finally {
    db.close();
  }
}

/**
 * Insert one document
 * @param {string} collection - Name of the collection
 * @param {object} document - Document object to insert
 * @return {object} - result from mongo
 */
async function insertOne(collection, document) {
  const db = await MongoClient.connect(config.mongoDbUri);
  try {
    const result = await db.collection(collection).insertOne(document);
    return result.ops[0];
  } finally {
    db.close();
  }
}

/**
 * Insert multiple documents
 * @param {string} collection - Name of the collection
 * @param {array} documents - Documents to insert
 * @returns {object} - result from mongo
 */
async function insertMany(collection, documents) {
  const db = await MongoClient.connect(config.mongoDbUri);
  try {
    const result = await db.collection(collection).insertMany(documents);
    return result.ops;
  } finally {
    db.close();
  }
}

/**
 * Updates one document
 * @param {string} collection - Name of the collection
 * @param {object} query - Query to execute against collection
 * @param {object} set - Fields to Update
 * @return {object} - response from mongo
 */
async function updateOne(collection, query, set) {
  const db = await MongoClient.connect(config.mongoDbUri);
  try {
    const response = await db.collection(collection).updateOne(query, set);
    return response.result;
  } finally {
    db.close();
  }
}

/**
 * Updates many documents
 * @param {string} collection - Name of the collection
 * @param {object} query - Query to execute against collection
 * @param {object} set - Fields to Update
 * @return {object} - response from mongo
 */
async function updateMany(collection, query, set) {
  const db = await MongoClient.connect(config.mongoDbUri);
  try {
    const response = await db.collection(collection).updateMany(query, set);
    return response.result;
  } finally {
    db.close();
  }
}

/**
 * Removes documents from a collection based on collection of ids
 * @param {string} collection - Name of the collection
 * @param {array} idsToDelete - List of ids to remove
 * @return {object} - response from mongo
 */
async function removeById(collection, idsToDelete) {
  const db = await MongoClient.connect(config.mongoDbUri);
  try {
    const response = await db.collection(collection).remove({
      _id: { $in: idsToDelete }
    });
    return response.result;
  } finally {
    db.close();
  }
}

module.exports = {
  aggregate,
  findAll,
  findOne,
  insertOne,
  insertMany,
  updateOne,
  removeById,
  updateMany
};

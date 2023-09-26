/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
    {
      '$match': {
        'product': new ObjectId('642ef8c8b77e766119169d36')
      }
    }, {
      '$group': {
        '_id': null, 
        'averageRating': {
          '$avg': '$rating'
        }, 
        'numOfReviews': {
          '$sum': '$rating'
        }
      }
    }
  ];
  
  const client = await MongoClient.connect(
    'mongodb://localhost:27017/',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const coll = client.db('commerce').collection('reviews');
  const cursor = coll.aggregate(agg);
  const result = await cursor.toArray();
  await client.close();
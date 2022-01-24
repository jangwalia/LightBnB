const properties = require('./json/properties.json');
const users = require('./json/users.json');
//using node pg
const {Pool} = require('pg');
require('dotenv').config();
//connecting to database
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE
});
/// Users


/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email)=> {
  const queryString = `SELECT * FROM users
  WHERE email = $1;
  `
  let value = [email]
 return pool.query(queryString,value)
  .then((res)=>{
    
    return res.rows[0];
    
  })
  .catch((err)=>{
    
    return null;
  })
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
  SELECT * FROM users
  WHERE id = $1;
`
const values = [id]
return pool.query(queryString,values)
.then((res)=>{
  console.log(res.rows[0]);
  return res.rows[0];
})
.catch((err)=>{
  
  return null;
})
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
 
 const name = user.name;
 const email = user.email;
 const password = user.password;
 const queryString  = `
 INSERT INTO users(name,email,password)VALUES ($1,$2,$3) RETURNING *;
 
 `
 const values = [name,email,password];
 return pool.query(queryString,values)
 .then((res)=>{
   
   return res.rows;
 })
 .catch((err)=>{
    return null;
 })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
`
const values = [guest_id,limit];
return pool.query(queryString,values)
.then((res)=>{
  
  return res.rows;
})
.catch((err)=>{
  
  return null;
})

}
exports.getAllReservations = getAllReservations;

/// Properties
const getDollarAmount = (amount)=>{
  let price = Number(amount)
  return price * 100;
}
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  
  `;
  
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE properties.city LIKE $${queryParams.length}`;
    }
    if(options.owner_id){
      if(queryParams.length >= 1){
        queryParams.push(options.owner_id);
        queryString += `AND properties.owner_id = $${queryParams.length}`
      }
      else{
        queryParams.push(options.owner_id);
        queryString += `WHERE properties.owner_id = $${queryParams.length}`
      }
    }
    if(options.minimum_price_per_night) {
      if(queryParams.length >= 1){
        queryParams.push(getDollarAmount(options.minimum_price_per_night));
        queryString += ` AND properties.cost_per_night >= $${queryParams.length}`;
      }else{
        queryParams.push(getDollarAmount(options.minimum_price_per_night));
        queryString += ` WHERE properties.cost_per_night >= $${queryParams.length}`;
      }
  }
    if(options.maximum_price_per_night) {
      if(queryParams.length >= 1){
        queryParams.push(getDollarAmount(options.maximum_price_per_night));
        queryString += `AND properties.cost_per_night <= $${queryParams.length}`;
      }
      else{
        queryParams.push(getDollarAmount(options.maximum_price_per_night));
        queryString += `WHERE properties.cost_per_night <= $${queryParams.length}`;
      }
 
  
    }
  
  
 queryString += `
 GROUP BY properties.id
 
 `
  // 3
 if(options.minimum_rating) {
   queryParams.push(options.minimum_rating);
   queryString += `
   HAVING avg(property_reviews.rating) >= $${queryParams.length}
   
   `;
 }

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
 

  // 6

  return pool.query(queryString, queryParams)
  .then((res) => {
    //console.log(res.rows);
    
    return res.rows;
  })
  .catch((err)=>{
    console.log(err);
    return null;
  })

}
    

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const owner_id = property.owner_id;
  const title = property.title;
  const description = property.description;
  const thumbnail_photo_url = property.thumbnail_photo_url;
  const cover_photo_url = property.cover_photo_url;
  const cost_per_night = property.cost_per_night;
  const street = property.street;
  const city = property.city;
  const province = property.province;
  const post_code = property.post_code;
  const country = property.country;
  const parking_spaces = property.parking_spaces;
  const number_of_bathrooms = property.number_of_bathrooms;
  const number_of_bedrooms = property.number_of_bedrooms;

  const queryString = `INSERT INTO properties (title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, province, city, country, street, post_code,active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    RETURNING *;
    `
  const values = [title,description,owner_id,cover_photo_url,thumbnail_photo_url,cost_per_night,parking_spaces,number_of_bathrooms,number_of_bedrooms,province,city,country,street,post_code,true];
  return pool.query(queryString,values)
  .then((res)=>{
    return res.rows;
  })
  .catch((err)=>{
    
    return null;
  })
}
exports.addProperty = addProperty;

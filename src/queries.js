const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'biEdronek',
  port: 5432,
})


function getUsers(){
  return new Promise((resolve,reject) => {
    pool.query('SELECT user_id,firstname,lastname,email FROM public.users', (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.stringify(results.rows));
    });    
})}

function getSchedules(){
  return new Promise((resolve,reject) => {
    pool.query('SELECT * FROM public.schedules', (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.stringify(results.rows));
    });    
})}

function getUsersbyID(id) {
  return new Promise((resolve,reject) => {
    pool.query(`SELECT user_id,firstname,lastname,email FROM public.users WHERE user_id=${id}`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.stringify(results.rows));
    });    
})}

function getUsersbyemail(email,what) {
  return new Promise((resolve,reject) => {
    pool.query(`SELECT user_id,firstname,lastname,email FROM public.users WHERE email='${email}'`, (error, results) => {
      if (error) {
        reject(error);
      }
      if (what == "count") {
        try {resolve(JSON.stringify(results.rowCount))}
        catch(e) {resolve(0)}
      }
      else {
        try {resolve(JSON.stringify(results.rows))}
        catch(e) {resolve("")}
      }
    });    
})}


function getSchedulebyID(id) {
  return new Promise((resolve,reject) => {
    pool.query(`SELECT * FROM public.schedules WHERE "User_ID"=${id}`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.stringify(results.rows));
    });    
})}

  async function getSchedulesforUser(userid, day, from, to) {
    let dbanswer =  await pool.query(`SELECT "User_ID", "DAY", "FROM", "TO" FROM public.schedules where "User_ID" = ${userid} and "DAY" = ${day} and ("FROM" < '${to}' and '${from}' < "TO")`)
    if (JSON.stringify(dbanswer.rowCount) == 0) {
      try{let insertanswer = await pool.query(`INSERT INTO public.schedules("User_ID", "DAY", "FROM", "TO") VALUES (${userid}, ${day}, '${from}', '${to}')`);
      return "added"}
      catch(e){console.log(e);}
    }
    else {return JSON.stringify(dbanswer.rows)}
    }
  


function addUser(first,last,em,pas)  {
    pool.query(`INSERT INTO public.users (firstname, lastname, email, password) VALUES ('${first}','${last}','${em}','${pas}')`, (error, results) => {
        if (error) {
          throw error
        }}
        );
    }

    function addSchedule(id,day,from,to)  {
      console.log(`INSERT INTO public.schedules("User_ID", "DAY", "FROM", "TO") VALUES (${id}, ${day}, ${from}, ${to})`);
      pool.query(`INSERT INTO public.schedules("User_ID", "DAY", "FROM", "TO") VALUES (${id}, ${day}, '${from}', '${to}')`, (error, results) => {
          if (error) {
            throw error
          }}
          );
      }
  


  module.exports = {
    getUsers,
    addUser,
    getSchedules,
    getSchedulesforUser,
    addSchedule,
    getUsersbyID,
    getSchedulebyID,
    getUsersbyemail
  }  

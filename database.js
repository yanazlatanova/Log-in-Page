
// Set up sqlite - no need of connection
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

//Create Database
db.serialize(() => {
    db.run('CREATE TABLE users (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, role TEXT, password TEXT)')
    db.run('INSERT INTO users (username, role, password) VALUES ("user1", "student", "$2b$10$H8RhcGaR7YZ72.X5lcUBNOQec39/fw3dCvZo/ocTQK1xQ0i46A2ym")')    
    db.run('INSERT INTO users (username, role, password) VALUES ("user2", "student", "$2b$10$H8RhcGaR7YZ72.X5lcUBNOQec39/fw3dCvZo/ocTQK1xQ0i46A2ym")')
    db.run('INSERT INTO users (username, role, password) VALUES ("user3", "teacher", "$2b$10$H8RhcGaR7YZ72.X5lcUBNOQec39/fw3dCvZo/ocTQK1xQ0i46A2ym")')  
    db.run('INSERT INTO users (username, role, password) VALUES ("admin", "admin", "$2b$10$/tl26I/fhZWstZ/6ju8CS.OtA7Ggn9hxNG1iooSKE9WOCFIO5j//O")')
})

const getUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", (err, result) => {
            if (err) {
                reject("Error: " + err.message)
            } else {
                resolve(result)
            }
        });
    })
}

async function getUserByName(username) {
    try {
        let users = await getUsers()
        let user = null

        users.forEach(function (row) {
            //console.log(row.username, username, " do they match ", row.username == username);
            if (row.username == username) {          
                user = row
            }
        }); 

        return user   

    } catch (error) {
        console.log("An error occured", err)
    }
}

module.exports = { getUsers, getUserByName };


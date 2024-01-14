var foundUser = null; // or undefined

var id = foundUser?._id;
console.log(id); 
const timed = new Date()
const time = Date.now()
const timeInTenMinutes = Date.now() + 30 * 60 * 1000
console.log(time, timed, timeInTenMinutes)
console.log(30 * 60 * 1000)
//This line is checking if foundUser is defined (i.e., not null or undefined). If foundUser is defined, it then accesses the _id property of foundUser. If foundUser is not defined, the expression will return undefined without throwing an error.
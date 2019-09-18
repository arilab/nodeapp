var fs = require('fs');

const dataFilePath = __dirname + '/' + 'users.json';

exports.listAll = function() {
    let existingUsers = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    return existingUsers;
}

exports.retrieve = function(id) {
    let existingUsers = exports.listAll();
    let position = findById(existingUsers, id);
    if (position == -1) {
        throw Error('Cannot find user id: ' + id);
    }
    let user = existingUsers[position];
    return user;
}

exports.add = function(newUser) {
    let existingUsers = exports.listAll();
    if (newUser.id == null) {
        throw new Error('Missing user id');
    }
    if (!Number.isInteger(newUser.id)) {
        throw new Error('User id: ' + newUser.id + ' must be a number');
    }
    var position = findById(existingUsers, newUser.id);
    if (position != -1) {
        throw new Error('User id: '+newUser.id+' already exists');
    }
    existingUsers.push(newUser);
    var content = JSON.stringify(existingUsers);
    fs.writeFileSync(dataFilePath, content);
}

exports.delete = function(id) {
    let existingUsers = exports.listAll();
    var position = findById(existingUsers, id);
    if (position == -1) {
        throw new Error('Cannot find user id: '+id);
    }
    existingUsers.splice(position, 1);
    var content = JSON.stringify(existingUsers);
    fs.writeFileSync('users.json', content);
}

findById = function(users, id) {
    return users.findIndex(user => user.id == id);
}
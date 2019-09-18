var rewire = require("rewire");
var assert = require('assert');
var expect = require('expect');

var persistUser = rewire("../persistUser.js");

var fileContent = "[{\"name\":\"mahesh\",\"password\":\"password1\",\"profession\":\"teacher\",\"id\":1},\
{\"name\":\"suresh\",\"password\":\"password2\",\"profession\":\"librarian\",\"id\":2},\
{\"name\":\"ramesh\",\"password\":\"password3\",\"profession\":\"clerk\",\"id\":3}]";

var User = function(request) {
    // Constructor
    if (request.name)
        var userName = request.name;
    else
        var userName = null;
  
    if (request.password)
        var userPassword = request.password;
    else
        var userPassword = null;

    if (request.profession)
        var userProfession = request.profession;
    else
        var userProfession = null;
  
    if (request.id)
        var userId = request.id;
    else
        var userId = null;
  
    // Return properties
    return {
      name: userName,
      password: userPassword,
      profession: userProfession,
      id: userId
    };
};

describe('persistUser', function() {
    var cont;
    var fsStub = {
        readFileSync: function (path, encoding) {
            return fileContent;
        },
        writeFileSync: function (path, content) {
            cont = content;
        }
    }
    persistUser.__set__('fs', fsStub)

    describe('listAll', function() {
        it('should return first user name', function() {
            var firstUser = persistUser.listAll()[0];
            assert.equal(firstUser.name, "mahesh");
        });
    });
    describe('retrieve', function() {
        it('should return user id: 2 password', function() {
            var secondUser = persistUser.retrieve(2);
            assert.equal(secondUser.password, "password2");
        });
    });
    describe('retrieve', function() {
        it('should throw error when user is not found', function() {
            assert.throws(() => {
                persistUser.retrieve(0);
            }, /^Error: Cannot find user id: 0/)
        });
    });
    describe('add', function() {
        it('should throw error when user missing id', function() {
            var newUser = User({name:"alain", password:"pwd", profession:"doctor"});
            assert.throws(()=>{persistUser.add(newUser)}, /^Error: Missing user id$/);
        });
    });
    describe('add', function() {
        it('should throw error when user id is a string', function() {
            var newUser = User({name:"alain", password:"pwd", profession:"doctor", id:"8"});
            assert.throws(()=>{persistUser.add(newUser)}, /^Error: User id: 8 must be a number$/);
        });
    });
    describe('add', function() {
        it('should throw error when user id is a letter', function() {
            var newUser = User({name:"alain", password:"pwd", profession:"doctor", id:"B"});
            assert.throws(()=>{persistUser.add(newUser)}, /^Error: User id: B must be a number$/);
        });
    });
    describe('add', function() {
        it('should throw error when user id already exist', function() {
            var newUser = User({name:"alain", password:"pwd", profession:"doctor", id:1});
            assert.throws(()=>{persistUser.add(newUser)}, /^Error: User id: 1 already exists$/);
        });
    });
    describe('add', function() {
        it('should add the new user to the file', function() {
            var newUser = User({name:"alain", password:"pwd", profession:"doctor", id:9});
            persistUser.add(newUser);
            expect(cont).toMatch(/"name":"alain"/);
        });
    });
    describe('delete', function() {
        it('should throw error when user is not found', function() {
            assert.throws(() => {
                persistUser.delete(0);
            }, /^Error: Cannot find user id: 0/)
        });
    });
    describe('delete', function() {
        it('should remove user id: 3', function() {
            persistUser.delete(3);
            expect(cont).not.toMatch(/"id":3}/);
        });
    });
});
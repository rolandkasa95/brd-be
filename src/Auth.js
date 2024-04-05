var LocalStrategy = require('passport-local');

const localUser = 'admin'
const localPassword = 'Adminuser10@@'

module.exports = function getLocalStrategy(){
    return new LocalStrategy(
        function(username, password, done) {
          return done(null, {localUser, localPassword})
          if(localUser === username && password === localPassword){
            return done(null, {localUser, localPassword})
          }

          return done(null, false)
        }
      )
}
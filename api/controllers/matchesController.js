var mongoose        = require('mongoose');
var Room            = require('../models/room');
var User            = require('../models/users');

var UserInMatch            = require('../models/userInMatch');
// const io = require('../../server').io;
var configuration = JSON.parse(require('fs').readFileSync('./configuration.json', 'utf8'));

var io = require('socket.io-emitter')({ host: configuration.address, port: 6379 });

exports.listMatches = (req, res) => {
    var query = Room.find({});
    query.exec(function(err, matches){
        if(err)
            res.send(err);
        else
            res.json(matches);
    });
};
function emitPositions(roomName){
    UserInMatch
        .find({
            roomName : roomName,
            location: { $ne: null }
        })
        .where()
        .exec(function(error, users){
            if(error) {

            }
            else{
                var positions = [];
                users.forEach(user =>{
                    positions.push(mapToPosition(user));
                });
                io.to(roomName).emit('users-pos',positions);
            }
        });
}
function mapToPosition(item, index) {
    var position = item.location.coordinates
    return {
        username: item.name,
        position: {
            latitude:position[0],
            longitude:position[1]
        },
        team: item.team
    };
}
exports.deleteUserInMatch= (req,res)=>{

    // Room.findOneAndUpdate(query1, { $pull: {users: req.params.username} },{new:true}, function (err,room) {
    //     if(err){
    //         return res.send(err);
    //     }else{
    //         // console.log(room.users);
    //         io.to(req.params.roomName).emit('users',{users:room.users});
    //     }
    // });
    //Notificare
    var query = UserInMatch.deleteMany({
        roomName : req.params.roomName,
        name: req.params.username
    });
    query.exec(function (err,raw) {
        if(err)
            res.send(err)
        else{
            console.log(raw);
            var usersQuery = UserInMatch.find({
                roomName : req.params.roomName
                // location:{
                //     type: 'Point',
                //     coordinates:  { $ne: null }
                // }
            });
            usersQuery.exec(
                function (error,usersR) {
                    if(error){
                        res.send(error);

                    }else{
                        // console.log("Ciao");
                        // console.log(usersR);
                        var positions = [];
                        usersR.forEach(user =>{
                            if(user.location){
                                positions.push(mapToPosition(user));
                            }
                        });
                        console.log("Dopo canc: ",positions);
                        emitLeaderboardRoom(req.params.roomName).then(data=>{
                            io.to(req.params.roomName).emit('users-pos',positions);
                            res.json("ok");
                        },err=>res.json("err"));

                    }
                }
            );
        }
    });
};
function startTimer(roomName) {
    setTimeout(() => {
        updateMatchState(roomName,"STARTED");
        io.to(roomName).emit('timeout',{message:"STARTED"});
    }, 60000);
}
exports.listMatchesRange = (req,res)=> {
    var lat =    Number(req.query.lat);
    var lon =    Number(req.query.lon);
    var query = Room.where('location').within({ center: [lon,lat], radius: req.query.radius, unique: true, spherical: true });
    query.exec(function (err,rooms) {
        if(err) res.send(err)
        else  res.json(rooms)
    });
};

exports.matchState = (req,res) =>{
        var query = Room.findOne({
            roomName : req.params.roomName
        });
        query.exec(function(err, state){
            if(err)
                res.status(400).send(err);
            else
                res.json({
                    state: state.state
                });
        });
}
// function emitLeaderboard(){
//     User
//         .find()
//         .sort({score: -1})
//         .select({username:1,score:1,team:1})
//         .exec(function(err, users){
//             if(err){
//             }
//             else{
//                 io.emit('users-leaderboard',users);
//             }
//         });
// }
function emitLeaderboard(){
    User
        .find()
        .sort({score: -1})
        .select({username:1,score:1})
        .exec(function(err, users){
            if(err){
            }
            else{
                io.emit('users-leaderboard',users);
            }
        });
}
function mapToScore(item, index) {
    var score = item.score
    return {
        username: item.name,
        score: score,
        team: item.team
    };
}
async function emitLeaderboardRoom(roomName){
    const leaderboard = await UserInMatch
        .find({
            roomName : roomName
        },{new:true})
        .sort({score: -1})
        .select({name:1,score:1,team:1})
        .exec();
    // console.log(leaderboard);
    var usersScore = [];
    if(leaderboard.length ===0){
        io.to(roomName).emit('users-score',usersScore);
    }
    for(i = 0;i< leaderboard.length;i++){
        mapUser(leaderboard[i]).then(temp=>{
            // console.log(temp);
            usersScore.push(temp);
            if(usersScore.length === leaderboard.length){
                console.log("Leaderboard: ",usersScore);
                io.to(roomName).emit('users-score',usersScore);
            }
        }).catch(err=>{
            console.log(err);
        });
    }
    // console.log("emit",usersScore);
}
// async function emitLeaderboardRoom(roomName){
//     // var find = UserInMatch
//     //     .find({
//     //         roomName : roomName
//     //     })
//     //     .sort({score: -1})
//     //     .select({username:1,score:1,team:1})
//     //     .exec(function(err, users){
//     //         if(err){
//     //         }
//     //         else{
//     //             var usersScore = [];
//     //             users.forEach(user =>{
//     //                     usersScore.push(mapToScore(user));
//     //             });
//     //             io.to(roomName).emit('users-score',usersScore);
//     //         }
//     //     });
//     const leaderboard = await UserInMatch
//         .find({
//             roomName : roomName
//         })
//         .sort({score: -1})
//         .select({name:1,score:1,team:1})
//         .exec();
//     // console.log(leaderboard);
//     var usersScore = [];
//     for(i = 0;i< leaderboard.length;i++){
//         const temp = await mapUser(leaderboard[i]);
//         usersScore.push(temp);
//     }
//     console.log("emit",usersScore);
//     io.to(roomName).emit('users-score',usersScore);
// }
async function mapUser(user){
    const scoreG = await User.findOne({username: user.name}).select({score:1}).exec();
    var temp = mapToScore(user);
    temp.scoreG = scoreG.score;
    return temp;
}

// function emitLeaderboardRoom(roomName){
//     var find = UserInMatch
//         .find({
//             roomName : roomName
//         })
//         .sort({score: -1})
//         .select({username:1,score:1,team:1})
//         .exec(function(err, users){
//             if(err){
//             }
//             else{
//                 var usersScore = [];
//                 users.forEach(user =>{
//                     usersScore.push(mapToScore(user));
//                 });
//                 io.to(roomName).emit('users-score',usersScore);
//             }
//         });
// }
function updateLeaderBoard(roomName) {
    var query = UserInMatch.find({
        roomName : roomName
    });
    query.exec(function(err, users){
        if(err){
        }else{
            users.forEach(user=>{
                var query = {
                    username: user.name
                };
                User.findOneAndUpdate(query, { $inc: {score: user.score} }, function (err,upUser) {
                });
            });
            emitLeaderboard();
        }
    });
}

function updateMatchState(roomName,state){
    var query = {
        roomName: roomName
    };
    Room.findOneAndUpdate(query, { state:state }, {upsert:false,new:true}, function (err,room) {
        if(err){

        }else{
            if(state==="ENDED"){
                console.log("Ciao Closed");
                getMatchesAndEmit();
                updateLeaderBoard(roomName);
            }else{
                getMatchesAndEmit();
                setTimeout(() => {
                    updateMatchState(roomName,"ENDED");
                    io.to(roomName).emit('timeout',{message:"ENDED"});
                }, room.duration*60000);
            }
        }
    });

}
exports.setMatchState = (req, res) => {
    var query = {
        roomName: req.params.roomName
    };
    Room.findOneAndUpdate(query, { state: req.body.state }, {upsert:false}, function (err,user) {
        if (err) {
            return res.send(err)
        } else {
            getMatchesAndEmit();
            res.json(req.body)
        }
    });
};

exports.addUserToMatch = (req,res)=>{
        console.log(req.params);
        console.log(req.body)
        var query = {
            roomName: req.params.roomName
        };
        Room.findOne(query,function (err,room) {
            if(err){
                return res.send(err);
            }else{
                if(room.state==='CLOSED'){
                    return res.status(406).send({error:"The match is closed"});
                }
                if(room.visibility==='Private'){
                    if(room.password!==req.body.password){
                        return res.status(401).send({error:"Wrong Match Password"});
                    }
                }
                var userQuery = {
                    roomName: req.params.roomName,
                }
                UserInMatch.find(userQuery,function (err,usersInMatch) {
                   if(err){
                   }else{
                       const users = usersInMatch.map(u=> u.name);
                       console.log(users)
                       if(users.includes(req.body.username)){
                           return res.status(401).send({error:"User already registred"});
                       }
                       if(users.length >= room.max_user){
                           return res.status(406).send({error:"The Room is full"});
                       }
                       UserInMatch.create({
                           name: req.body.username,
                           roomName: req.params.roomName,
                           location: req.body.location ,
                           score:req.body.score,
                           team: req.body.team
                       },function (err,createdUser) {
                           if(err){
                               console.log(err);
                           }
                           else{
                               console.log(createdUser);
                                emitLeaderboardRoom(req.params.roomName);
                                emitPositions(req.params.roomName);
                                res.json(createdUser);
                           }
                       });
                   }
                });

                // var options = {new: true};
                // Room.findOneAndUpdate(query, { $push: {users: req.body.username} },options, function (err,room) {
                //     if (err) {
                //         return res.send(err)
                //     } else {
                //         console.log(room.users);
                //         io.to(req.params.roomName).emit('users',{users:room.users});
                //         res.json(room)
                //         var query1 = {
                //             username: req.body.username,
                //             roomName: req.params.roomName
                //         };
                //         console.log(req.body);
                //         UserInMatch.findOneAndUpdate(query1, { location: req.body.location ,score:req.body.score,team: req.body.team}, {upsert:true,new:true}, function (err,user) {
                //             if (err) {
                //
                //             } else {
                //                 emitLeaderboardRoom(req.params.roomName);
                //             }
                //         });
                //     }
                // });
            }
        });


}
function getMatchesAndEmit(){
    var query = Room.find({});
    query.exec(function(err, matches){
        if(err){
            // res.send(err);
        }
        else{
            io.emit('matches',{matches:matches});
        }
    });
}
exports.createMatch = (req, res) => {
    console.log(req.body);

    var b = req.body;

    const date = new Date();

    b.created_at = date;
    b.starting_time = new Date(date.getTime() + 60000);

    var newMatch = new Room(b);

    newMatch.save(function(err){
        if(err)
            res.status(400).send("Match name already exists, choose another one");
        else {
            getMatchesAndEmit();
            startTimer(req.body.roomName);
            res.json(newMatch);
        }

    });
};

exports.readMatch = (req, res) => {
    var query = Room.findOne({
        roomName : req.params.matchId
    });
    query.exec(function(err, match){
        if(err)
            res.status(400).send(err);
        else
            res.send(match);
    });
};

exports.updateMatch = (req, res) => {

};

exports.deleteMatch = (req, res) => {
    var query = Room.deleteOne({
        roomName : req.params.matchId
    })
    query.exec(function (err,raw) {
        if(err)
            res.send(err)
        else{
            getMatchesAndEmit();
            res.send(raw)
        }
    });
};


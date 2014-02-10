var serverConf={
    cookieSecret: 'microblogbyvoid',
    db: 'JvEuaGkClPYVBLWXarTh',
    host: 'mongo.duapp.com',
    port:'8908',
    user:'YdQqkHD83AqKIxPxRoOVd0wN',
    password:'dyp6Ur2X7L5LFpyxGEc4IkOUeLGEbNeF'
},localConf={
    cookieSecret: 'microblogbyvoid',
    db: 'microblog',
    host: 'localhost'
};
module.exports =(
    SERVER_SORTWARE == 'bae/3.0' ?
    serverConf :
    localConf
    );
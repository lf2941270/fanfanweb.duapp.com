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
    host: 'localhost',
    port:'27017',
    user:'',
    password:''
};
module.exports =(
    (process.env.BAE_ENV_APPID=='appid4wxmfatc0t') ?
    serverConf :
    localConf
    );
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  }
});

var User = sequelize.define('user', {
  id: {
    type: Sequelize.STRING(50),
    primaryKey: true
  },
  name: Sequelize.STRING(100),
  password: Sequelize.BOOLEAN,
  user_type: Sequelize.STRING(10),
  email: Sequelize.BIGINT,
  phone: Sequelize.BIGINT
}, {
  timestamps: false
});
var now = Date.now();
// (async () => {
//   var user1 = await User.create({
//     id: 2,
//     name: 'Odie',
//     password: '123456',
//     user_type: 1,
//     email: '909557134@qq.com',
//     phone: '18566427530',
//   });
//   console.log('created: ' + JSON.stringify(user1));
// })();

// (async () => {
//   var users = await User.findAll({
//     where: {
//       name: 'admin'
//     }
//   });
//   console.log(`find ${users.length} users:`);
//   for (let p of users) {
//     console.log(JSON.stringify(p));
//   }
// })();

// (async () => {
//   var p = await User.find({
//     where: {
//       id: 2
//     }
//   });
//   p.phone = '12345678910';
//   await p.save();
// })();

// (async () => {
//   var p = await User.find({
//     where: {
//       id: 2
//     }
//   });
//   await p.destroy();
// })();

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

app.use(bodyParser());
app.use(cors());
// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

router.get('/hello/:id', async (ctx, next) => {
  var id = ctx.params.id;
  // ctx.response.body = `<h1>Hello,${name}</h1>`;
  let GetJson = async () => {
    var p = await User.find({
      where: {
        id: id
      }
    });
    return {
      code: 200,
      data: p
    }
    // resolve({
    //   code: 200,
    //   data: p
    // });
  };
  ctx.body = await GetJson();
})

router.get('/', async (ctx, next) => {
  ctx.response.body = `<h1>Index</h1>`;
})

app.use(router.routes());
// // 对于任何请求，app将调用该异步函数处理请求：
// app.use(async (ctx, next) => {
//   await next();
//   ctx.response.type = 'text/html';
//   ctx.response.body = '<h1>Hello, koa2!</h1>';
// });

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');
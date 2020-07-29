const router = require('koa-router')(),
    Mock=require('mockjs');

router.prefix('/users');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!';
});

router.get('/json', function (ctx, next) {
  ctx.body = Mock.mock({
      'data|100':[{
          'id|+1':100,
          'createTime|+5000':Date.now()
      }]
  });
});

module.exports = router;

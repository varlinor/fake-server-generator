const router = require('koa-router')();

router.prefix('/index');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Fake API Server',
      subTitle:'——used to support fake api service'
  })
});


module.exports = router;

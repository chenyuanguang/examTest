var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('client/pc/index', { title: '网站刷题系统' });
});
router.get('/pc/workstore', function(req, res, next) {
    res.render('client/pc/workstore', { title: '网站刷题系统' });
});


// 移动页面
router.get('/m', function(req, res, next) {
    res.render('client/m/index', { title: '网站刷题系统' });
});
router.get('/m/questionDetail', function(req, res, next) {
    res.render('client/m/questionDetail', { title: '网站刷题系统' });
});
router.get('/m/questionResult', function(req, res, next) {
    res.render('client/m/questionResult', { title: '网站刷题系统' });
});
router.get('/m/questionAnalyze', function(req, res, next) {
    res.render('client/m/questionAnalyze', { title: '网站刷题系统' });
});
module.exports = router;
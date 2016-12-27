var express = require('express'),
    question = require('./routes/question'),
    answer = require('./routes/answer'),
    q_comment = require('./routes/q_comment'),
    comment = require('./routes/comment'),
    orm = require('orm');

var app = express();
app.use(express.bodyParser());
app.use(orm.express("sqlite://db.sqlite3", {
    define: function (db, models, next) {
        models.question = db.define('question', {
            user: String,
            detail: String
        });
        models.q_comment = db.define('q_comment', {
            user: String,
            detail: String
        });
        models.q_comment.hasOne(
            'question',
            models.question,
            {reverse: 'q_comments'}
        );
        models.answer = db.define('answer', {
            user: String,
            detail: String
        });
        models.answer.hasOne(
            'question',
            models.question,
            {reverse: 'answers'}
        );
        models.comment = db.define('comment', {
            user: String,
            detail: String
        });
        models.comment.hasOne(
            'answer',
            models.answer,
            {reverse: 'comments'}
        );
        db.sync(function (err) {
            console.log('sync callback');
        });
        next();
    }
}));

app.get('/', question.start);  //a starting url
app.get('/start', question.start);  //a starting url

//questions
app.get('/questions', question.getquestions);  //get all questions
app.post('/questions', question.postquestion);  //upload a question
app.put('/question/:question_id', question.updatequestion);   //update a question
app.get('/question/:question_id', question.getaquestion);  //get a question
app.del('/question/:question_id', question.deletequestion);  //delete a question

//answers
app.get('/question/:question_id/answers', answer.getanswers);  //get all answers
app.post('/question/:question_id/answers', answer.postanswer);  //upload an answer
app.put('/question/:question_id/answer/:answer_id', answer.updateanswer);  //update an answer
app.get('/question/:question_id/answer/:answer_id', answer.getaanswer);  //get an answer
app.del('/question/:question_id/answer/:answer_id', answer.deleteanswer);  //delete an answer


//comments of questions
app.get('/question/:question_id/q_comments', q_comment.getq_comments);  //get all comments of a question
app.post('/question/:question_id/q_comments', q_comment.postq_comment);  //upload a comment of a question
app.put('/question/:question_id/q_comment/:q_comment_id', q_comment.updateq_comment);  //update a comment of a question
app.get('/question/:question_id/q_comment/:q_comment_id', q_comment.getaq_comment);  //get a comment of a question
app.del('/question/:question_id/q_comment/:q_comment_id', q_comment.deleteq_comment);  //delete a comment of a question


//comments of answers
app.get('/question/:question_id/answer/:answer_id/comments', comment.getcomments);  //get all comments of an answer
app.post('/question/:question_id/answer/:answer_id/comments', comment.postcomment);  //upload a comment of an answer
app.put('/question/:question_id/answer/:answer_id/comment/:comment_id', comment.updatecomment);  //get a comment of an answer
app.del('/question/:question_id/answer/:answer_id/comment/:comment_id', comment.deletecomment);  //delete a comment of an answer


app.listen(8880);

console.log('listening..');

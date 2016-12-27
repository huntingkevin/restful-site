// get the last question and its answers
exports.start = function (req, res) {
    // 
    var qn = '',
        max_id = 0;
    req.models.question.aggregate({}).max("id").get(function (err, max) {
        max_id = max;
        req.models.question.get(max_id, function (err, question) {
            if (err === null) {
                qn = question;
                req.models.answer.find(
                    {'question_id': max_id},
                    function (err, answers) {
                        if (err === null) {
                            res.status(200).send("The latest question: " + JSON.stringify(qn) + "\nAll answers of this question: " + JSON.stringify(answers));
                            console.log("get all answers of a question successfully!.");
                        } else {
                            res.status(404).send('Not found');
                        }
                    }
                );
            } else {
                res.status(404).send('Not found');
            }
        });
    });
};

//get all questions
exports.getquestions = function (req, res) {
    req.models.question.count(function (no_questions) {
        console.log(no_questions + ' questions');
    });
    req.models.question.find(
        {},
        {},
        function (err, all_questions) {
            res.status(200).send("All questions: " + JSON.stringify(all_questions));
            console.log("get all questions successfully!");
        }
    );
};

//upload a question
exports.postquestion = function (req, res) {
    req.models.question.create(
        [{
            user: req.body.user,
            detail: req.body.detail
        }],
        function (err, questions_created) {
            res.status(201).send("The question created: " + JSON.stringify(questions_created));
            console.log("post a question successfully!");
        }
    );
};

//update a question
exports.updatequestion = function (req, res) {
    var id = req.params.question_id;
    req.models.question.get(id, function (err, Q) {
        if ((Q.user === req.body.user) && (Q.detail === req.body.detail)) {
            res.status(204).send(" ");
        } else {
            Q.user = req.body.user;
            Q.detail = req.body.detail;
            Q.save(function (err) {
                console.log("update a question successfully!");
            },
                function (err, questions_created) {
                    res.status(201).send("question updated: " + JSON.stringify(questions_created));
                });
        }
    });
};

//get a question
exports.getaquestion = function (req, res) {
    req.models.question.get(req.params.question_id, function (err, question) {
        if (err === null) {
            res.status(200).send("The question: " + JSON.stringify(question));
            console.log("get a question successfully!");
        } else {
            res.status(404).send('Not found');
        }
    });
};

// remove answer comment function
var removeComments = function (err, coms) {
    var j = 0;
    for (j in coms) {
        if (coms.hasOwnProperty(j)) {
            coms[j].remove();
        }
    }
};

//delete a question
exports.deletequestion = function (req, res) {
//Firstly, delete comments and answers of this question
    req.models.question.get(req.params.question_id, function (err, qn) {
        qn.getAnswers(function (err, ars) {
            var i = 0;
            for (i in ars) {
                if (ars.hasOwnProperty(i)) {
                    ars[i].getComments(removeComments);
                    ars[i].remove();
                }
            }
        });
        qn.getQ_comments(function (err, q_comments) {
            var n = 0;
            for (n in q_comments) {
                if (q_comments.hasOwnProperty(n)) {
                    q_comments[n].remove();
                }
            }
        });
        qn.remove(function (err) {
            console.log("delete a question successfully!");
        });
    });
    res.status(200).send("delelte a question successfully!");
};

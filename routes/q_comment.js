 //get all comments of a question
exports.getq_comments = function (req, res) {
    req.models.q_comment.find(
        {'question': req.params.question_id},
        function (err, q_comments) {
            if (err === null) {
                res.status(200).send("All question comments: " + JSON.stringify(q_comments));
                console.log("get question comments successfully!");
            } else {
                res.status(404).send('Not found');
            }
        }
    );
};

//get a comment of a question
exports.getaq_comment = function (req, res) {
    req.models.q_comment.get(req.params.q_comment_id, function (err, q_comment) {
        if (err === null) {
            res.status(200).send("The question comment: " + JSON.stringify(q_comment));
            console.log("get a qustion comment successfully");
        } else {
            res.status(404).send('Not found');
        }
    }
        );
};

//upload a comment of question
exports.postq_comment = function (req, res) {
// same issue as above regarding validation

    req.models.question.get(
        req.params.question_id,
        function (err, question) {
            if (err === null) {
                req.models.q_comment.create(
                    [{
                        user: req.body.user,
                        detail: req.body.detail//,
                        //question: req.parameters.question_id
                    } ], // object
                    function (err, q_comments_created) {
                        if (err === null) {
                            var q_comment = q_comments_created[0];
                            q_comment.setQuestion(question, function (err) {
                                if (err === null) {
                                    res.status(201).send("Question comment created: " + JSON.stringify(q_comment));
                                    console.log("post a question comment successfully!");
                                } else {
                                    console.log('q_comment.setquestion err: ' + err);
                                    res.status(404).send("Not found");
                                }
                            });
                        } else {
                            console.log('req.models.q_comment.create err: ' + err);
                            res.status(404).send("Not found");
                        }
                    }
                );
            } else {
                console.log('req.models.q_comment.get err: ' + err);
                res.status(404).send("Not found");
            }
        }
    );
};

//update a comment of a question
exports.updateq_comment = function (req, res) {
    var id = req.params.q_comment_id;
    req.models.q_comment.get(id, function (err, C) {
        if ((C.user === req.body.user) && (C.detail === req.body.detail)) {
            res.status(204).send(" ");
        } else {
            C.user = req.body.user;
            C.detail = req.body.detail;
            C.save(function (err) {
                console.log("update a question comment successfully!");
            },
                function (err, q_comments_created) {
                    res.status(201).send("question comment updated: " + JSON.stringify(q_comments_created));
                });
        }
    });
};

//delete a comment of a question
exports.deleteq_comment = function (req, res) {
    req.models.q_comment.get(req.params.q_comment_id, function (err, item) {
        item.remove(function (err) {
            req.models.q_comment.find(
                {'question': req.params.question_id},
                function (err, q_comments) {
                    if (err === null) {
                        res.status(200).send("question comments left: " + JSON.stringify(q_comments));
                        console.log("delete a question comment successfully!");
                    } else {
                        res.status(404).send('Not found');
                    }
                }
            );
        });
    });
};
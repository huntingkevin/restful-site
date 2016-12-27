//get all comments of an answer
exports.getcomments = function (req, res) {
// 
    req.models.comment.find(
        {'answer': req.params.answer_id},
        function (err, comments) {
            if (err === null) {
                res.status(200).send("All comments: " + JSON.stringify(comments));
                console.log("get all answer comments successfully!");
            } else {
                res.status(404).send('Not found');
            }
        }
    );
};

//upload a comment of an answer
exports.postcomment = function (req, res) {
    req.models.question.get(
        req.params.question_id,
        function (err, question) {
            if (err === null) {
                req.models.answer.get(
                    req.params.answer_id,
                    function (err, answer) {
                        if (err === null) {
                            req.models.comment.create(
                                [{
                                    user: req.body.user,
                                    detail: req.body.detail
                                } ],
                                function (err, comments_created) {
                                    if (err === null) {
                                        var comment = comments_created[0];
                                        comment.setAnswer(answer, function (err) {
                                            if (err === null) {
                                                res.status(201).send("comment created: " + JSON.stringify(comment));
                                                console.log("post an answer comment successfully!");
                                            } else {
                                                res.status(404).Send("Not found");
                                                console.log('comment.setAnswer err: ' + err);
                                            }
                                        });
                                    } else {
                                        console.log('req.models.commet.create err: ' + err);
                                        res.status(404).send("Not found");
                                    }
                                }
                            );
                        } else {
                            console.log('req.models.comment.get err: ' + err);
                            res.status(404).send("Not found");
                        }
                    }
                );
            } else {
                console.log('req.models.answer.get err: ' + err);
                res.status(404).send("Not found");
            }
        }
    );
};

//update a comment of an answer
exports.updatecomment = function (req, res) {
    var id = req.params.comment_id;
    req.models.comment.get(id, function (err, C) {
        if ((C.user === req.body.user) && (C.detail === req.body.detail)) {
            res.status(204).send();
        } else {
            C.user = req.body.user;
            C.detail = req.body.detail;
            C.save(function (err) {
                console.log("update an answer comment successfully!");
            },
                function (err, comments_created) {
                    res.status(201).send("answer comment updated: " + JSON.stringify(comments_created));
                });
        }
    });
};

//delete a comment of an answer
exports.deletecomment = function (req, res) {
    req.models.comment.get(req.params.comment_id, function (err, item) {
        item.remove(function (err) {
            req.models.comment.find(
                {'answer': req.params.answer_id},
                function (err, comments) {
                    if (err === null) {
                        res.status(200).send("answer comments left now: " + JSON.stringify(comments));
                    } else {
                        res.status(404).send('Not found');
                    }
                }
            );
            console.log("delete an answer comment successfully!");
        });
    }
        );
};
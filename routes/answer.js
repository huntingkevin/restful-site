//get all answers
exports.getanswers = function (req, res) {
    // 
    req.models.answer.find(
        {'question': req.params.question_id},
        function (err, answers) {
            if (err === null) {
                res.status(200).send("All answers: " + JSON.stringify(answers));
                console.log("get all answers successfully!.");
            } else {
                res.status(404).send('Not found');
            }
        }
    );
};

//update an answer
exports.updateanswer = function (req, res) {
    var id = req.params.answer_id;
    req.models.answer.get(id, function (err, A) {
        if ((A.user === req.body.user) && (A.detail === req.body.detail)) {
            res.status(204).send();
        } else {
            A.user = req.body.user;
            A.detail = req.body.detail;
            A.save(function (err) {
                console.log("update an answer successfully!");
            },
                function (err, answers_created) {
                    res.status(201).send("Answer updated: " + JSON.stringify(answers_created));
                });
        }
    });
};

//get an answer 
exports.getaanswer = function (req, res) {
    req.models.answer.get(req.params.answer_id, function (err, answer) {
        if (err === null) {
            res.status(200).send("The answer is: " + JSON.stringify(answer));
            console.log("get an answer successfully!");
        } else {
            res.status(404).send('Not found');
        }
    });
};

//upload an answer 
exports.postanswer = function (req, res) {
    // same issue as above regarding validation
    req.models.question.get(
        req.params.question_id,
        function (err, question) {
            if (err === null) {
                req.models.answer.create(
                    [{
                        user: req.body.user,
                        detail: req.body.detail//,
                        //question: req.parameters.question_id
                    }], // object
                    function (err, answers_created) {
                        if (err === null) {
                            var answer = answers_created[0];
                            answer.setQuestion(question, function (err) {
                                if (err === null) {
                                    res.status(201).send("Answer created: " + JSON.stringify(answer));
                                    console.log("post an answer successfully!");
                                } else {
                                    console.log('answer.setquestion err: ' + err);
                                    res.status(404).send("Not found");
                                }
                            });
                        } else {
                            console.log('req.models.answer.create err: ' + err);
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

//delete an answer
exports.deleteanswer = function (req, res) {
    req.models.comment.find({answer_id: req.params.answer_id}).remove();

    req.models.answer.get(req.params.answer_id, function (err, item) {
        item.remove(function (err) {
            req.models.answer.find(
                {'question': req.params.question_id},
                function (err, answers) {
                    if (err === null) {
                        res.status(200).send("Answers left now: " + JSON.stringify(answers));
                        console.log("delete an answer successfully!");
                    } else {
                        res.status(404).send('Not found');
                    }
                }
            );
        });
    });
};

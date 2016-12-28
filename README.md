## 1.  Database

First ofall, we created a sqlite3 database, and created 4 tables in this database. Theyare:

- question(id, user, detail)
- q_comment(id, question_id,user, detail)
- answer(id, question_id, user,detail)
- comment(id, answer_id, user, detail)

## 2.  URL

The designof the URLs:

- localhost:8880/start
- localhost:8880/questions
- localhost:8880/question/:question_id
- localhost:8880/question/:question_id/q_comments
- localhost:8880/question/:question_id/answers
- localhost:8880/question/:question_id/answer/:answer_id
- localhost:8880/question/:question_id/answer/:answer_id/comments

Inside theURLs, ‘q_comments’ means the comment of questions, ‘comments’ means the commentof answers.

## 3.  Functionality

- The main entrance is in app.js. URLsuse different functions, and there are 4 .js documents to separate these levelsof URLs;
- The first URL: /start can show thelatest question and all its answers;
- Questions, comments of questions,answers and comments of answers can be uploaded, retrieved, updated and deletedby using POST, GET, PUT, DELETE methods;
- In DELETE method, when we delete ananswer, its comments will be deleted automatically. Similarly, when we delete aquestion, all comments and answers will be deleted as well;
- Heads of pages can be obtained;
-  Using different HTTP status codes topresent the states of response, including 200 OK, 201 Created, 204 No Contentand 404 Not Found.

## 4.  Testing(Bash) and Examples

We createda .sh document in Ubuntu, and used series of curl commands to test our project.

1. Testing4 types of HTTP verbs:

   - To test POST method, we used commands like:

     curl -d “user=jerry&detail=what is my name?”localhost:8880/questions

   - To test GET method, we used commandslike:

     curl localhost:8880/questions

   - To test PUT method, we used commandslike:

     curl -X PUT -d user=”jerry” -d detail=”jerry ismy name” localhost:8880/question/1

   - To test DELETE method, we usedcommands like:

     curl -X DELETElocalhost:8880/question/1/answer/2/comment/3

2. Testing HEAD:

   - We used one kind of command to getthe head of a page:

     curl --HEAD localhost:8880/questions


   - We added “-i” after “curl” to getthe head when implementing other methods:

     curl –ilocalhost:8880/question/1/answers

## 5 Brief Guide

We have aproject folder called “webservice”. First of all, you should use commands toinstall express, orm and sqlite3. Secondly, use node to open app.js to startthe server. Thirdly, use another terminal program to run the testing documentusing “bash” command. Finally, the results with descriptions will be shown onthe screen.
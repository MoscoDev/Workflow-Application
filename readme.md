Workflow Application - 
Design a system which requires interaction between users. Simplest example would be author > editor with the object being passed is an article. Author submits article, editor approves or rejects it. Can find other examples of this type of process in other fields. 

Scope: Onboarding of authors and editors 
High-Level Design: Signup and Sign-in (authentication)
Deep dive: Signup
Email
Username
Password
Phone number
Sign - in:
Email 
Password.
Max. number of user a document can be shared with = 100
DB type: MongodB (NoSQL)

Wrap up:
Data size for each user == 5kb,
Total no of users = 5,000/year
No of years for = 10years,
Total space requirement = 5kb * 5,000 * 10 = 250,000kb = 250mb 

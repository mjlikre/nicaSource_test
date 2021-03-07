# nicaSource_test

This repository is to contain the test requirements by NicaSource's technical test for Node.js developer. 

# important 
clone the repo and then add in a .env file (for development purposes), with the following variables: 

SECRET_KEY = "whateverStringThatYouWant" (yes, all caps for the variable name please)

REFRESH_TOKEN_SECRET = "whateverStringThatYouWant" (yes, all caps for the variable name please)

to run the backend, run: node index.js, or if you have nodemon, use nodemon would be best (personal favorite, nothing to do with the 
server itself)

# Testing with postman
if you would like to test just the server in dev mode, append http://localhost:3001 in front of the endpoints and put paste them 
into postman and run your request from
postman
The server is set up on port 3001, the following are a list of endpoints:
# public/unprotected routes
- /api/auth/signup POST
- /api/auth/signin POST

remember once you signup or signin, grap the token that the server responded with and save it somewhere for later 
accessing protected routes

# protected routes
- /api/statistics GET
- /api/statistics/:country_name POST & GET (allows you to read(get) or write(post) specific country's data )


as for the protected routes, simply go to header section of postman, add in a new header variable: authorization: theTokenThatYouGotFromSigningInOrSigningUp
then you will be able to access the protected ruotes 



# MERN_Template

JWT Authentication

Socket IO 

HOC - Higher Level Components

Persistent Login

The following Environment Variables must be created.

ENV
DATABASE
SALT
SECRET


ENV determines if the Environment is either Production or Development
DATABASE holds the Mongo DB Link
SALT will contains the "js-sha256" NPM library key to encrypt and decrypt User Model passwords
SECRET is the key used to encrypt and decrypt the JWT token


If we pass socket than we don't need to define Authentication, we can pass this as a PROP



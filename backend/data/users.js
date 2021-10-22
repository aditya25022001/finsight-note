import bcrypt from 'bcryptjs'

const users = [
    {
        name:"Aditya Ubale",
        email:"adityaubale63@gmail.com",
        password : bcrypt.hashSync('AdityaUbale01@#', 10)
    },
    {
        name:"Akshat Mishra",
        email:"akshatmishra73@gmail.com",
        password : bcrypt.hashSync('AkshatMishra@#', 10)
    },
    {
        name:"Eshan Pandey",
        email:"eshanpandey01@gmail.com",
        password : bcrypt.hashSync('EshanPandey01@#', 10)
    }
]

export default users
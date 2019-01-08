// const bcrypt = require('bcryptjs');


// module.exports = {
//     register: async (req, res) => {
//         const db = req.app.get('db');
//         const { username, password, isAdmin } = req.body;
//         const result = await db.get_user([username])
//         const existingUser = result[0];
//         if (existingUser) {
//             return res.status(409).send('Username Taken')
//         }
//         const salt = bcrypt.genSaltSync(10);
//         console.log(password);
//         const hash = bcrypt.hashSync(password, salt);
//         const registeredUser = await db.register_user([isAdmin, username, hash]);
//         const user = registeredUser[0]
//         req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
//         res.status(201).send(req.session.user)
//     },
// }

const bcrypt = require("bcryptjs");

module.exports = {
    register: async (req, res) => {
        let { username, password, isAdmin } = req.body;
        const db = req.app.get("db");

        let existingUser = await db.get_user([username]);
        let result = existingUser[0]
        if (result) {
            return res.status(409).send("Username Taken");
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            let newUser = await db.register_user([isAdmin, username, hash]);

            let user = newUser[0];

            req.session.user = {
                isAdmin: user.is_admin,
                username: user.username,
                id: user.id
            };
            return res.status(201).send(req.session.user);
        }
    },

    login: async (req, res) => {
        let { username, password } = req.body;
        const db = req.app.get('db');

        let foundUser = await db.get_user([username])
        let user = foundUser[0]

        if (!user) {
            return res.status(401).send('User Not Found. Please Register');
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        if (isAuthenticated === false) {
            return res.status(403).send('Incorrect Password')
        }
        req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username};
        return res.send(req.session.user)

    },
    logout: async (req, res) => {
        req.session.destroy()
        res.status(200).send('Logged Out')
    }
};
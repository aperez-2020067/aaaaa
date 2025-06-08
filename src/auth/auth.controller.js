import User from '../user/user.model.js';
import { checkPassword, encrypt } from '../../utils/encrypt.js';
import { generateJwt } from '../../utils/jwt.js';

//test
export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

// REGISTRO
export const register = async (req, res) => {
    try {
        let data = req.body;

       
        if (!['CLIENT', 'WORKER', 'ADMIN'].includes(data.role)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid role. Must be CLIENT, WORKER or ADMIN.'
            });
        }

      
        const existingUser = await User.findOne({
            $or: [{ email: data.email }, { username: data.username }]
        });

        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: 'Username or email already exists'
            });
        }

       
        let user = new User(data);
        user.password = await encrypt(user.password);
        user.userStatus = true;

        await user.save();

        return res.send({
            success: true,
            message: `Registered successfully, can be logged with username: ${user.username}`
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'General error with registering user',
            err 
        });
    }
};

//Login
export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Username/email and password are required' });
        }

        // Buscar usuario por username O email usando el campo "identifier"
        const user = await User.findOne({
            $or: [
                { username: identifier.toLowerCase() },
                { email: identifier.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await checkPassword(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const loggedUser = {
            uid: user._id,
            name: user.name,
            username: user.username,
            role: user.role
        };

        const token = await generateJwt(loggedUser);

        return res.json({ success: true, message: `Welcome, ${user.name}`, loggedUser, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'General error with login function', error });
    }
};
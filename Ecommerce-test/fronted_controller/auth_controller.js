
const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const api_config = require('../config/api');
const ApiResponse = require('../response/ApiResponse');
const ErrorRespnse = require('../response/error_response');
const geoip = require('geoip-lite');
const useragent = require('useragent');

const { sendOtp } = require('../helpers/mailhelper');
const AuthController = {

    // async create_user(req, res, next) {
    //     console.log('body', req.body);

    //     // Validate required fields
    //     if (!req.body.password || !req.body.email || !req.body.name) {
    //         return res.status(400).json(new ErrorRespnse(400, 'All fields are required'));
    //     }



    //     try {
    //         // Check if user already exists
    //         const existingUser = await User.findOne({
    //             $or: [
    //                 { email: req.body.email },
    //                 { name: req.body.name }
    //             ]
    //         });

    //         if (existingUser) {
    //             return res.status(400).json(new ErrorRespnse(400, 'User already exists with this email or name'));
    //         }

    //         // Create new user
    //         const newUser = new User({
    //             name: req.body.name,
    //             email: req.body.email,
    //             password: bcrypt.hashSync(req.body.password, 10),
    //         });



    //         const user = await newUser.save();

    //         const otp = Math.floor(100000 + Math.random() * 900000);

    //         await sendOtp('email@gmail.com', otp, 'register');

    //         res.status(201).json(new ApiResponse(201, 'User has been created successfully', user));
    //     } catch (err) {
    //         console.log('error on register', err);
    //         res.status(500).json(new ErrorRespnse(500, 'Something went wrong, please try again', err.message));
    //     }
    // },

    async create_user(req, res, next) {
        console.log('body', req.body);

        // Validate required fields
        if (!req.body.password || !req.body.email || !req.body.name) {
            return res.status(400).json(new ErrorRespnse(400, 'All fields are required'));
        }

        try {
            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [
                    { email: req.body.email },
                ]
            });

            if (existingUser) {
                return res.status(400).json(new ErrorRespnse(400, 'User already exists with this email'));
            }

            // Create new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
            });

            const user = await newUser.save();
            const otp = Math.floor(1000 + Math.random() * 9000);


            await sendOtp(user.email, otp, 'register');

            user.otp = otp;
            user.otpExpiry = Date.now() + 10 * 60 * 1000;
            await user.save();

            res.status(201).json(new ApiResponse(201, 'User has been created successfully. OTP sent to email.', user));
        } catch (err) {
            console.log('error on register', err);
            res.status(500).json(new ErrorRespnse(500, 'Something went wrong, please try again', err.message));
        }
    },


    async verify_otp(req, res, next) {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json(new ErrorRespnse(400, 'Email and OTP are required'));
        }

        try {
            // Find the user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json(new ErrorRespnse(400, 'User not found'));
            }

            // Check if the OTP matches and hasn't expired
            // parse number
            if (user.otp !== Number(otp)) {
                return res.status(400).json(new ErrorRespnse(400, 'Invalid OTP'));
            }

            if (user.otpExpiry < Date.now()) {
                return res.status(400).json(new ErrorRespnse(400, 'OTP has expired'));
            }

            // OTP is correct and valid
            user.isVerified = true;
            user.otp = null;  // Clear OTP after successful verification
            user.otpExpiry = null; // Clear OTP expiry
            await user.save();

            res.status(200).json(new ApiResponse(200, 'OTP verified successfully. User is now verified.', user));
        } catch (err) {
            console.log('error verifying OTP', err);
            res.status(500).json(new ErrorRespnse(500, 'Something went wrong, please try again', err.message));
        }
    },



    async login_user(req, res, next) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json(new ErrorRespnse(400, 'All fields are required'))
        }

        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(400).json(new ErrorRespnse(400, 'User does not exist'));
            }

            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(400).json(new ErrorRespnse(400, 'Invalid credentials'));
            }

            // Check if user is verified
            if (!user.isVerified) {
                // Generate and send OTP for verification
                const otp = Math.floor(1000 + Math.random() * 9000);
                await sendOtp(user.email, otp, 'login');

                // Store OTP and expiry
                user.otp = otp;
                user.otpExpiry = Date.now() + 10 * 60 * 1000;  // 10 minutes expiry
                await user.save();

                return res.status(400).json(new ErrorRespnse(400, 'Email not verified. OTP sent for verification.'));
            }


            // const ip = req.ip || req.body.ip; // Assuming IP is sent in the body if not available in the request object
            // const geo = geoip.lookup(ip);
            // const country = geo ? geo.country : 'Unknown'; // Default to 'Unknown' if country can't be determined

            // // Get browser and device details from user-agent
            // const agent = useragent.parse(req.headers['user-agent']);
            // const browser = agent.toAgent(); // Browser name/version
            // const device = agent.device.family || 'Unknown'; // Device name





            // user.lastLogin = {
            //     ip,
            //     country,
            //     browser,
            //     device,
            // };

            // user.lastLogin = Date.now();
            // user.browser = browser;
            // user.device = device;
            // user.country = country;
            // user.ip = ip;
            await user.save();


            // Generate JWT token
            const accessToken = jwt.sign({
                id: user._id,
                email: user.email,
            }, 'secret', { expiresIn: "1d" });

            const { password, otp, otpExpiry, ...data } = user._doc;

            return res.status(200).json(new ApiResponse(200, 'Successfully logged in', { ...data, accessToken }));
        } catch (err) {
            console.log('login error', err);
            res.status(500).json(new ErrorRespnse(500, 'Something went wrong, please try again', err.message));
        }
    },


    async resend_otp(req, res, next) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(new ErrorRespnse(400, 'Email is required'));
        }

        try {
            // Find the user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json(new ErrorRespnse(400, 'User not found'));
            }

            // Check if OTP has expired
            if (user.otpExpiry < Date.now()) {
                // OTP has expired, generate a new one
                const otp = Math.floor(1000 + Math.random() * 9000);

                // Send OTP to the user
                await sendOtp(user.email, otp, 'login');

                // Update OTP and expiry time
                user.otp = otp;
                user.otpExpiry = Date.now() + 10 * 60 * 1000;  // 10 minutes expiry
                await user.save();

                return res.status(200).json(new ApiResponse(200, 'New OTP has been sent to your email.'));
            }

            return res.status(400).json(new ErrorRespnse(400, 'OTP is still valid. Please check your email.'));
        } catch (err) {
            console.log('error resending OTP', err);
            res.status(500).json(new ErrorRespnse(500, 'Something went wrong, please try again', err.message));
        }
    },

    async get_all_users(req, res, next) {
        try {
            const users = await User.find().select('-password -otp -otpExpiry'); 

            if (!users || users.length === 0) {
                return res.status(404).json(new ErrorRespnse(404, 'No users found.'));
            }

            res.status(200).json(new ApiResponse(200, 'Users fetched successfully', users));
        } catch (err) {
            console.error('Error fetching users:', err.message);
            res.status(500).json(new ErrorRespnse(500, 'Something went wrong. Please try again.', err.message));
        }
    },

    async get_single_user(req, res, next) {
        const { id } = req.params; // Extract the user ID from the request parameters

        if (!id) {
            return res.status(400).json(new ErrorRespnse(400, 'User ID is required.'));
        }

        try {
            // Fetch user details by ID
            const user = await User.findById(id).select('-password -otp -otpExpiry'); // Exclude sensitive data

            if (!user) {
                return res.status(404).json(new ErrorRespnse(404, 'User not found.'));
            }

            res.status(200).json(new ApiResponse(200, 'User details fetched successfully.', user));
        } catch (err) {
            console.error('Error fetching user:', err.message);
            res.status(500).json(new ErrorRespnse(500, 'Something went wrong. Please try again.', err.message));
        }
    },

}

module.exports = AuthController
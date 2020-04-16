const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const config = require('config');
const request = require('request');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'No Profile found :{' });
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Some Error');
    }
});

// @route   POST api/profile
// @desc    Create or update profile
// @access  Private

router.post(
    '/', 
    [ 
        auth,
        [
            check('status', 'This field cannot be empty').not().isEmpty(),
            check('skills', 'This field cannot be empty').not().isEmpty()
        ] 
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.toString().split(',').map(skill => skill.trim());
        }

        // Build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id })

            if(profile) {
                // Update existing profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            // Create new user
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});

// @route   GET api/profile
// @desc    GET all profiles
// @access  Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/:id
// @desc    GET profile by user id
// @access  Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profiles = await Profile.findOne({user: req.params.user_id})
            .populate('user', ['name', 'avatar']);
        if (!profiles) {
            res.status(400).json({ msg: 'No such profile exists' })
        }
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile/
// @desc    DELETE profile, user, posts
// @access  Private

router.delete('/', auth, async (req, res) => {
    try {
        // remove users posts
        await Post.deleteMany({ user: req.user.id});

        // Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove User
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User  Deleted' });

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/experience
// @desc    Add Profile experience
// @access  Private

router.put(
    '/experience', 
    [
        auth,
        [
            check('title', 'This field cannot be empty').not().isEmpty(),
            check('company', 'This field cannot be empty').not().isEmpty(),
            check('from', 'This field cannot be empty').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete Profile experience
// @access  Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({user: req.user.id});
        // console.log(req.params.exp_id);
        // const removeIndex = profile.experience.map(item => item.id)
        //     .indexOf(req.param.exp_id);
        // console.log(removeIndex);
        // profile.experience.splice(removeIndex,1);
        // await profile.save();
        // Alternative way
        const updatedProfileExperience = profile.experience.filter(item => item.id !== req.params.exp_id);
        profile.experience = updatedProfileExperience;
        await profile.save();
        res.status(200).json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/education
// @desc    Add Profile education
// @access  Private

router.put(
    '/education',
    [
        auth,
        [
            check('school', 'This field cannot be empty').not().isEmpty(),
            check('degree', 'This field cannot be empty').not().isEmpty(),
            check('fieldofstudy', 'This field cannot be empty').not().isEmpty(),
            check('from', 'This field cannot be empty').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEducation = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEducation);
            await profile.save();
            res.status(200).json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete Profile education
// @access  Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        const upadatedProfileEducation = profile.education
            .filter(item => item.id !== req.params.edu_id);
        profile.education = upadatedProfileEducation;
        await profile.save();
        res.status(200).json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(200).send('Server Error');
    }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos
                ?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
                &client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }
        request(options, (error, response, body) => {
            if (error) console.error(error.message);
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }
            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
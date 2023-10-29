const yup = require('yup');

const userSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    firstname: yup.string().required(),
    lastname: yup.string().required(),
});

const userLoginSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

const commentSchema = yup.object({
    content: yup.string().required(),
});

const postSchema = yup.object({
    title: yup.string().required(),
    body: yup.string().required(),
    tags: yup.string().required(),
    parentId: yup.string(),
});
module.exports = {
    userSchema,
    userLoginSchema,
    commentSchema,
    postSchema,
};

# Register
POST {{baseUrl}}api/auth/register
Content-Type: application/x-www-form-urlencoded

email=test@gmail.com
password=123456
firstname=test
lastname=Test
fullname=1

# Login
POST {{baseUrl}}api/auth/login
Content-Type: application/x-www-form-urlencoded

email=test@gmail.com
password=123456

# Logout
GET {{baseUrl}}api/auth/logout

# Refresh Token
POST {{baseUrl}}api/auth/refresh-token

# Get Current User Info
GET {{baseUrl}}api/user/current-user

# Update User
PUT {{baseUrl}}api/user

# Remove User
DELETE {{baseUrl}}api/user

# Follow User
PUT {{baseUrl}}api/user/follow/id

# Unfollow User
PUT {{baseUrl}}api/user/unfollow/id

# Create Comment
POST {{baseUrl}}api/comment/id
Content-Type: application/x-www-form-urlencoded

content=dinhs
parentId=653e916ccc0c6673f18f5a44

# Get Reply Comments
GET {{baseUrl}}api/comment/reply/parentId

# Like Comment
PUT {{baseUrl}}api/comment/like/commentId

# Create Post
POST {{baseUrl}}api/post/
Content-Type: multipart/form-data

image=
title=
body=
tags=["reactjs", "fluter"]

# Delete Post
DELETE {{baseUrl}}api/post/postId

# Edit Post
PUT {{baseUrl}}api/post/postId
Content-Type: multipart/form-data

title=learn reactjs
tags=reacjs, webdev

# Get Posts
GET {{baseUrl}}api/post?fields=-updatedAt&page=1&limit=3

# Get Post
GET {{baseUrl}}api/post/postId

# Like Post
PUT {{baseUrl}}api/post/like/postId

# Unlike Post
PUT {{baseUrl}}api/post/unlike/postId

# Bookmark Post
PUT {{baseUrl}}api/post/bookmark/postId

# Unbookmark Post
PUT {{baseUrl}}api/post/unbookmark/postId

# Search Post
GET {{baseUrl}}api/post/search?q=reactjs

# Get Posts by Tag Discuss
GET {{baseUrl}}api/post/tag-discuss

# Follow Tag
PUT {{baseUrl}}api/tag/follow/tagId


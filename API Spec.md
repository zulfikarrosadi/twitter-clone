* Required Login
^^ fixed schema

## Tweet
- `GET /tweets/` Get All Tweets ^^
	Request
		param: no
		body: no
	Response
		success:
			status code: 200
				type: json
				schema:
					timelapse: time
					cursor: tweet cursor
					tweets:
						schema:
							id: int
							tweet: string | array
							createdAt: time
							updatedAt: time
							authorId: int
							tweet_child: array
								id: int
								tweet: string | array
							tweet_photos: array
								images: string
							tweet_comment: array
								id: int
								content: string
					error: null
		failed:
			status code: 404
				type: json
				schema:
					timelapse: null,
					cursor: null
					tweets: null,
					error: 'Tweet that you're search for, is doesn't exists'

- `GET /tweets/infinite/:cursor` Get Infinite Tweets ^^
	Request
		param:
			cursor:
				type: int
				description: memberi tahu harus dari tweet no berapa yang ditampilkan
		body: no
	Response:
		success:
			status code: 200
				type: json
				schema:
					timelapse: time
					cursor: tweet cursor
					tweets: tweets data
					error: null
		failed:
			status code: 404
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'There is no more tweets to load'
			status code: 400
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Your URL is invalid, make sure you clicked the right button :D'

- `GET /tweets/:id` Get single tweet ^^
	Request:
		param:
			id:
				type: int
				description: id dari tweet yang ingin ditampilkan
		body: no
	Response:
		success:
			status code: 200
				type: json
				schema:
					timelapse: time
					cursor: null
					tweets: single tweet data
					error: null
		failed:
			status code: 404
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Tweet that you're search for, is doesn't exists'
			status code: 400
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Your URL is invalid, make sure you clicked the right button :D'

- `POST /tweets` Post new twees * ^^
	Request:
		param: no
		body:
			type: form-data
				schema:
					tweets: string
					tweetPhotos: array of photo
	Response
		success:
			status code: 201
				type: json
					schema:
						timelapse: time
						cursor: null
						tweets: id tweet
						error: null
			failed
				status code: 400
					type: json
						schema:
							timelapse: null
							cursor: null
							tweets: null
							error: 'You dont have anything to upload :D'
				status code: 403
					type: json
						schema:
							timelapse: null
							cursor: null
							tweets: null
							error: 'You required to login to do this action'

- `DELETE /tweets/:idParent` deleting tweet parent * ^^
	Request
		param:
			idParent:
				type: int
				description: id dari parent tweet
		body: no
	Response
		success:
			status code: 204
		failed:
			status code: 404
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Tweet that you're search for, is doesn't exists'
			status code: 403
				type: json
					schema:
						timelapse: null
						cursor: null
						tweets: null
						error: 'You required to login to do this action'
			status code: 400
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Your URL is invalid, make sure you clicked the right button :D'

- `PATCH /tweets/:idParent` update the parent tweet * ^^
	Request
		param:
			idParent:
				type: int
				description: id dari parent tweet
			body: no
			form data:
				tweet:
					type: string
					description: new tweet
	Response
		success:
			status code: 200
				type: json
				schema:
					timelapse: time
					cursor: null
					tweets: id tweet
					error: null
		failed:
			status code: 400
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Tweet cannot be empty'
			status code: 404
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Tweet that you're search for, is doesn't exists'
			status code: 403
				type: json
					schema:
						timelapse: null
						cursor: null
						tweets: null
						error: 'You required to login to do this action'

- `PATCH /tweets/:idParent/:idChild` update the parent tweet * ^^
	Request
		param:
			idParent:
				type: int
				description: id dari parent tweet
			idChild:
				type: int
				description: id dari child tweet berdasarkan dari parent
			body: no
	Response
		success:
			status code: 200
				type: json
				schema:
					timelapse: time
					cursor: null
					tweets: id tweet
					error: null
		failed:
			status code: 400
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Tweet cannot be empty'
			status code: 404
				type: json
				schema:
					timelapse: null
					cursor: null
					tweets: null
					error: 'Tweet that you're search for, is doesn't exists'

## Comment
- `GET /tweets/comments/:idTweet` Get 10 first comment ^^
	Request
		param:
			idTweet:
				type: int
				description: tweet id that we want to get the first 10 comments
		body: no
	Response
		Success
			status code: 200
				type: json
				schema:
					timelapse: time,
					cursor: comment cursor (int),
					comment: array
						schema:
							id: int,
							content: comment (string)
							createdAt: string
							authorId: author that make the comment (int)
					error: null,
		Failed
			status code: 404
				type: json
				schema:
					timelapse: null,
					cursor: null,
					comment: null,
					error: 'The comment is not found'
			status code: 400
				type: json
					schema:
						timelapse: null,
						cursor: null,
						comment: null,
						error: 'Your URL is invalid, make sure you clicked the right button :D'

- `GET /tweets/comments/:idTweet/:cursor` Get the next 10 comment ^^
	Request
		param:
			idTweet:
				type: int
				description: tweet id that we want to get the first 10 comments
			cursor:
				type: int
				description: the last id tweet comment that shown to the user
		body: no
	Response
		Success
			status code: 200
				type: json
				schema:
					timelapse: time,
					cursor: comment cursor (int),
					comment: array
						schema:
							id: int,
							idTweetParent: int
							authorId: int
							content: comment (string)
							createdAt: string
					error: null,
		Failed
			status code: 404
				type: json
				schema:
					timelapse: null,
					cursor: null,
					comment: null,
					error: 'The comment is not found'
			status code: 400
				type: json
					schema:
						timelapse: null,
						cursor: null,
						comment: null,
						error: 'Your URL is invalid, make sure you clicked the right button :D'

- `POST /tweets/comments/` Post new comment * ^^
	Request
		param: no
		body:
			type: json
			schema:
				comment: string
	Response
		success
			status code: 201
				type: json
				schema:
					timelapse: time
					cursor: null
					comment: comment id (int)
					error: null
		failed
			status code: 400
				type: json
				schema:
					timelapse: null
					cursor: null
					comment: null
					error: "Upss... Somethings wrong, please try again :D"

- `DELETE /tweets/comments/:idComment` Delete comment * ^^
	Request
		param:
			idComment:
				type: int
				description: id comment that will be deleted
	Response
		success:
			status code: 200
				type: json
				scema:
					timelapse: time
					cursor: null
					comment: int (deleted comment id)
					error: null
		failed:
			status code: 404
				type: json
				schema:
					timelapse: null,
					cursor: null,
					comment: null,
					error: "Upps, comment is not found.. Try again",
			status code: 400
				type: json
					schema:
						timelapse: null,
						cursor: null,
						comment: null,
						error: 'Your URL is invalid, make sure you clicked the right button :D'

## User
- `POST \users\register` register and create new user session ^^
	Request
		param: no
		body:
			type: json
			schema:
				email: valid user email (string)
				name: string
				date of birth: time
				password: password with min lenght 6 chars (string)
				passwordConfirmation: password
	Response
		success
			status code: 201
				type: json
					schema:
						timelapse: time,
						error: null,
				type: cookie
					name: 'JERAWAT',
					value: hashedUserId
					maxAge: 1 hour / 1000 * 3600
					sameSite: lax
		failed
			status code: 400
				type: json
				schema:
					timelapse: null,
					error: array of object
						schema:
							path: input field (string)
							value: user input (string)
							message: error message (string)

- `POST \users\login` login user and create user session ^^
	Request
		param: no
		body: json
			schema:
				email: valid user email (string),
				password: valid user password (string)
	Response
		success
			status code: 200
				type: json
				schema:
						timelapse: time,
						error: null,
				type: cookie
					name: 'JERAWAT',
					value: hashedUserId
					maxAge: 1 hour / 1000 * 3600
					sameSite: lax
		failed
			status code: 400
				**if user failed on validation process**
				type: json
				schema:
					timelapse: null,
					user: null
					error: array of object
						schema:
							path: input field (string)
							value: user input (string)
							message: error message (string)
				**if user failed because no email or password is correct**
					type: json
					schema:
						timelapse: null
						error: 'Email or password is incorrect'

- `POST \users\logout` logout user * ^^
	Request
		param: no
		body: no
		cookie:
			name: JERAWAT
	Response
		success:
			status code: 200
		failed:
			status code: 400
				type: text
				schema:
					error: "Somethings wrong, let's go back to home"

## Register flow
- Input name
- email
- Date of birth
it''ll  send the verification code
- set password

## What can i update after registering new account
- change password, username, name, user photo profile, user photo banner
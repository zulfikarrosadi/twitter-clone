/**
 * validating user input to decide how the tweet is going to save on database
 * is the tweet has tweet_child? or user is provide the image file? etc
 * @param {tweet object} tweets
 * @param {Reqeust} files
 * @returns createOptionsObject
 */
const tweetSaveValidation = (tweets, files, user) => {
  const createOptions = { tweet: tweets, authorId: user };

  if (Array.isArray(tweets)) {
    createOptions.tweet = tweets.shift();
    createOptions.tweet_child = {
      createMany: {
        data: tweets.map((tweet) => ({
          tweet,
        })),
      },
    };
  }

  if (files) {
    createOptions.tweet_photos = {
      createMany: {
        data: files.map((file) => ({
          images: file.filename,
        })),
      },
    };
  }

  return createOptions;
};

const tweetUpdateValidation = (id, idChild, tweet) => {
  const updateOptions = {
    where: { id },
    data: { tweet },
  };

  if (idChild) {
    updateOptions.data = {
      tweet_child: {
        update: {
          where: { id: idChild },
          data: { tweet },
        },
      },
    };
  }

  return updateOptions;
};

/**
 * cursor is one of the component to create infiniteScroll feature in prisma
 * for mor information: https://prisma.com/docs
 * @param data resultQuery[]
 * @returns number
 */
const getCursor = (data) => data[data.length - 1].id;

module.exports = { tweetSaveValidation, tweetUpdateValidation, getCursor };

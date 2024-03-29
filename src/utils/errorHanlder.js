const errorHanlder = (error) => {
  let errorMessage;
  switch (error) {
    case 'INVALID_FILE_FORMAT':
      errorMessage =
        'Your file format is not supported, please just upload file with png, jpg, or jpeg format';
      break;
    case 'File too large':
      errorMessage = 'Your file is too large';
      break;
    case 'tweet is null':
      errorMessage = 'You dont have anything to upload :D';
      break;
    case 'Tweet not found':
      errorMessage = "Tweet that you're search for, is doesn't exists";
      break;
    case 'No more tweet':
      errorMessage = 'There is no more tweets to load';
      break;
    case 'Foreign key error':
      errorMessage = "You're trying to add comment to not existing tweet :D";
      break;
    case 'Comment not found':
      errorMessage = 'The comment is not found';
      break;
    case 'Request Url Invalid':
      errorMessage = 'Your URL is invalid, please double check it :D';
      break;
    default:
      break;
  }
  return errorMessage;
};

module.exports = errorHanlder;

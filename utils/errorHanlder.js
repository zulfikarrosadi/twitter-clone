const errorHanlder = (error) => {
  let errorMessage;
  switch (error) {
    case 'INVALID_FILE_FORMAT':
      errorMessage =
        'Your file format is not supported, please just upload file with png, jpg, or jpeg format';
      break;
    case 'Tweet not found':
      errorMessage = "Tweet that you're search for, is doesn't exists";
      break;
    case 'No more tweet':
      errorMessage = 'There is no more tweets to load';
      break;
    default:
      break;
  }
  return errorMessage;
};

module.exports = errorHanlder;

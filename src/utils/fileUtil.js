const { unlink } = require('fs/promises');
const { join } = require('path');

const deleteMultipleFile = async (files) => {
  const file = files.pop();
  if (!file) return;
  await unlink(join(__dirname, `../public/uploads/images/${file}`));
  deleteMultipleFile(files);
};

module.exports = deleteMultipleFile;

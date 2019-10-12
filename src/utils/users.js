const users = [];

const addUsers = ({ id, name, roomNumber }) => {
  name = name.trim().toLowerCase();
  roomNumber = roomNumber.trim().toLowerCase();

  if (!name || !roomNumber) {
    return {
      errors: 'Username and rooms are required'
    };
  }
  //Check for existing user
  const existingUsers = users.find(user => {
    return user.roomNumber === roomNumber && user.name === name;
  });

  //Validate username
  if (existingUsers) {
    return {
      error: 'Username is already used!'
    };
  }

  // all pass Store User
  const user = { id, name, roomNumber };
  users.push(user);
  return { user };
};

//remove user from array using findindex and slice
const removeUsers = id => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUsers = id => {
  return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();

  return users.filter(user => user.roomNumber === room);
};

module.exports = {
  addUsers,
  removeUsers,
  getUsers,
  getUsersInRoom
};

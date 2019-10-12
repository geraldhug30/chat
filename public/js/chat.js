const socket = io();

$messageForm = document.querySelector('#messageForm');
$messageFormInput = $messageForm.querySelector('input');
$messageFomrButton = $messageForm.querySelector('button');
$sendLocationButton = document.querySelector('#send-location');
$chatHere = document.querySelector('#chatHere');
$messages = document.getElementById('messages');
$sidenav = document.querySelector('#sidenav');

const scrolldown = () => {
  const $newMessage = $chatHere.lastElementChild;
  $newMessage.scrollIntoView();
};

// get data from emit in index.js
socket.on('textUpdated', text => {
  // main chat
  const markup = `
  <div id="messages">
  <h5>${text.name}  <span> ${moment(text.createdAt).format('h:m a')} <span></h5>
  <pre> ${text.text}</pre>
  </div>
  `;

  //<p>${text.createdAt}</p>
  $chatHere.insertAdjacentHTML('beforeend', markup);

  scrolldown();
});

socket.on('roomData', ({ room, users }) => {
  console.log(room);
  console.log(users);

  var insertedContent = document.querySelector('.insertedContent');
  if (insertedContent) {
    insertedContent.parentNode.removeChild(insertedContent);
  }

  // side nav
  let space = '';
  users.forEach(index => {
    space += `<a href='#'>${index.name}</a>`;
  });
  console.log(space);
  const markup = `
  <div class='insertedContent'>
  <h2>${room}</h2>
  <h3>Active</h3>
  ${space}
  </div>
  `;

  $sidenav.insertAdjacentHTML('afterbegin', markup);
});

messageForm.addEventListener('submit', el => {
  el.preventDefault();
  //disable button

  $messageFomrButton.setAttribute('disabled', 'disabled');
  // function that can call in chat.js
  // emit pass/send data to server or client
  // same as querySelector in function addEventListener
  const inputMessage = el.target.elements.message;

  socket.emit('sendMessage', inputMessage.value, error => {
    //enable button
    $messageFomrButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (error) console.log(error);
    console.log('Message Delivered');
  });
});

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  // disable button
  $sendLocationButton.setAttribute('disabled', 'disabled');
  // navigator.geolocation.getCurrentPosition(position => {
  //   socket.emit('getLocation', position);
  //   console.log(position);
  // });

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        $sendLocationButton.removeAttribute('disabled');
        console.log('shared location');
      }
    );
  });
  scrolldown();
});

// parse location
const parseLocation = parseURL(location.search);
const { searchObject } = parseLocation;

// room join
socket.emit('join', searchObject, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});

// const autoScroll = () => {
//   // new message element
//   const $newMessage = $messages.lastElementChild;

//   // Height of the new message
//   const newMessageStyles = getComputedStyle($newMessage);
//   const newMessageMargin = parseInt(newMessageStyles.marginBottom);
//   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
//   console.log(newMessageMargin);
//   //visible height
//   const visibleHeight = $messages.offsetHeight;

//   //height of messages container
//   const containerHeight = $messages.scrollHeight;

//   const scrollOffset = $messages.scrollTop + visibleHeight;
//   if (containerHeight - newMessageHeight <= scrollOffset) {
//     $messages.scrollTop = $messages.scrollHeight;
//   }
// };
// autoScroll();

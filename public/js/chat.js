const socket = io()

const $mesageForm = document.querySelector('#message-form')
const $messageFormInput = $mesageForm.querySelector('input')
const $messageFormButton = $mesageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username')
const room = urlParams.get('room')
console.log(room)
//const {username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // new messsage element
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginButtom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // messages visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const containerHeight = $messages.scrollHeight

    // how far I have scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('locationMessage', (data) => {
    console.log(data);
    const html = Mustache.render(locationMessageTemplate, {
        userName: data.userName,
        url: data.url,
        createdAt: moment(data.createdAt).format('hh:mm a') 
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('message', (data) => {
   console.log(data) 
   const html = Mustache.render(messageTemplate, {
        userName: data.userName,
        message: data.text,
        createdAt: moment(data.createdAt).format('hh:mm a')
   })
   $messages.insertAdjacentHTML('beforeend', html)
   autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$mesageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // make button disabled
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {

        // make button enabled
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('The message was delivered')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        alert('Geoloction is not supported by your browser')
    }
    
    // make button disabled
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            // make button enabled
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
} )

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
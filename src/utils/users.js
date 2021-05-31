const users = []

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

const addUser = ({ id, userName, room }) => {
    userName = userName.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!userName || !room){
        return {
            error: "Username and Room required"
        } 
    }

    const existingUser = users.find((user) => {
        return user.userName === userName && user.room === room
    })

    if(existingUser){
        return {
            error: "Username is in use!"
        }
    }

    // store user
    const user = {id, userName, room}
    users.push(user)
    return { user }
}


const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

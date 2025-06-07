const who = document.getElementById('name')
const rtType = document.getElementById('rt-type')
const startRt = document.getElementById('start-rt')
const tableBody = document.getElementById('grid')
const form = document.querySelector('form')
const clearAllBtn = document.getElementById('reset-btn')
const clearFirstBtn = document.getElementById('first-btn')
const clearLastBtn = document.getElementById('last-btn')
const modalDisplay = document.getElementById('modal-outer')

let rowItems = JSON.parse(localStorage.getItem('rowItems')) || []
// console.log(rowItems)
function saveToLocalStorage() {
    localStorage.setItem('rowItems', JSON.stringify(rowItems))
}

function render() {
    tableBody.innerHTML = `<div class="row table-head">
                    <div class="item">Name</div>
                    <div class="item">Type</div>
                    <div class="item">Start</div>
                    <div class="item">End</div>
                    <div class="item">Time</div>
                </div>`
    rowItems.forEach(item => {
        createRow(item)
    });
    
}

clearLastBtn.addEventListener('click', function(e) {
    e.preventDefault()
    rowItems.pop()
    saveToLocalStorage()
    render()
})

clearFirstBtn.addEventListener('click', function(e) {
    e.preventDefault()
    rowItems.shift()
    saveToLocalStorage()
    render()
})

clearAllBtn.addEventListener('click', function(e){
    e.preventDefault()
    rowItems = []
    saveToLocalStorage()
    render()
})

function createRow(item) {
    // create row
    const row = document.createElement('div')
    row.classList.add('row', 'table-item')

    // create name cell
    const nameCell = document.createElement('div')
    nameCell.textContent = item.name
    nameCell.classList.add('item')
    nameCell.style.position = 'relative'
    

    //  add edit btn
    const editRow = document.createElement('i')
    editRow.classList.add('fa-solid', 'fa-user-pen')
    nameCell.appendChild(editRow)

    editRow.addEventListener( 'click', function() {
        modalDisplay.style.display = 'block'
        document.getElementById('main').style.opacity = '.5'
        const newNameInput = document.getElementById('new-name')
        const newRtType = document.getElementById('new-rt-type')
        newNameInput.placeholder = item.name
        newRtType.value = item.type

        document.getElementById('edit-row').addEventListener('click', function(e) {
            e.preventDefault()
            item.name = newNameInput.value
            item.type = newRtType.value
            saveToLocalStorage()
            modalDisplay.style.display = 'none'
            document.getElementById('main').style.opacity = '1'
            render()
        })

    })

    // create rt type cell
    const typeCell = document.createElement('div')
    typeCell.textContent = item.type
    typeCell.classList.add('item')

    // create start time cell
    const startCell = document.createElement('div')
    startCell.classList.add('item')
    const startTime = new Date(item.startTime)
    startCell.textContent = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // crate empty end and elapsed cells for data later on
    const endCell = document.createElement('div')
    endCell.classList.add('item')

    const elapsedCell = document.createElement('div')
    elapsedCell.classList.add('item')

    // create end cell and button
    const action = document.createElement('div')
    action.classList.add('item', 'end-cell')
  
    // check if item has an end time on load if not loads button and event listener
    if (!item.endTime) {
        const endBtn = document.createElement('button')
        endBtn.className = "btn end-btn"
        endBtn.textContent = 'End'
        
        // add event to end button
        endBtn.addEventListener('click', function(e) {
            e.preventDefault()
            const endTime = new Date()
            const elapsedMS = endTime.getTime() - item.startTime
            const minutes = Math.ceil(elapsedMS / 60000)

            item.endTime = endTime.getTime()
            saveToLocalStorage()

            // fill in empty cells from above
            endCell.textContent = endTime.toLocaleString([], { hour: '2-digit', minute: '2-digit' })
            elapsedCell.textContent = `${minutes} min`

            action.remove()
            row.append(endCell, elapsedCell)

        }) 
        action.append(endBtn)
        row.append(nameCell, typeCell, startCell, action)   
    
    } else {
        // if item has end time, create new date object and set it to the time MS then do maths and fill in the empty <td>'s
        const endTime = new Date(item.endTime)
        const elapsedMS = endTime.getTime() - item.startTime
        const minutes = Math.ceil(elapsedMS / 60000)

        endCell.textContent = endTime.toLocaleString([], { hour: '2-digit', minute: '2-digit' })
        elapsedCell.textContent = `${minutes} minutes`

        row.append(nameCell, typeCell, startCell, endCell, elapsedCell)
    }
    tableBody.appendChild(row)
}

document.getElementById('close-modal').addEventListener('click', function() {
    modalDisplay.style.display = 'none'
    document.getElementById('main').style.opacity = '1'
})

startRt.addEventListener('click', function(e) {
    e.preventDefault()
    const startTime = new Date()
    
    const newItem = {
        name: who.value.toUpperCase(),
        type: rtType.value,
        startTime: startTime.getTime(),
        endTime: null,
    }

    console.log(newItem)
    rowItems.push(newItem)
    saveToLocalStorage()
    createRow(newItem)
    who.value = ''
    rtType.value = ''
})

render()


// pwa service worker and install

let deferredPrompt

window.addEventListener('beforeinstallprompt', e => {
    // prevent defult prompt
    e.preventDefault()

    deferredPrompt = e;

    const installButton = document.getElementById('install-btn')
    installButton.style.display = 'inline-block'

    installButton.addEventListener('click', () => {
        deferredPrompt.prompt()

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted prompt')
            }
            else {
                console.log('User dismissed prompt')
            }
            deferredPrompt = null
        })
    })
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
}
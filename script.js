const who = document.getElementById('name')
const rtType = document.getElementById('rt-type')
const startRt = document.getElementById('start-rt')
const tableBody = document.getElementById('table-body')
const form = document.querySelector('form')
const clearAllBtn = document.getElementById('reset-btn')
const clearFirstBtn = document.getElementById('first-btn')
const clearLastBtn = document.getElementById('last-btn')

let rtItems = JSON.parse(localStorage.getItem('rtItems')) || []
console.log(rtItems)
function saveToLocalStorage() {
    localStorage.setItem('rtItems', JSON.stringify(rtItems))
}


rtItems.forEach(item => {
    createRow(item)
});

clearLastBtn.addEventListener('click', function() {
    rtItems.pop()
    saveToLocalStorage()
    location.reload()
})

clearFirstBtn.addEventListener('click', function() {
    rtItems.shift()
    saveToLocalStorage()
    location.reload()
})

clearAllBtn.addEventListener('click', function(e){
    e.preventDefault()
    localStorage.clear()
    location.reload()
})

function createRow(item) {
    console.log('creating row for:', item)
    // create row
    const row = document.createElement('tr')

    // create name cell
    const nameCell = document.createElement('td')
    nameCell.textContent = item.name

    // create rt type cell
    const typeCell = document.createElement('td')
    typeCell.textContent = item.type

    // create start time cell
    const startCell = document.createElement('td')
    const startTime = new Date(item.startTime)
    startCell.textContent = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // crate empty end and elapsed cells for data later on
    const endCell = document.createElement('td')
    const elapsedCell = document.createElement('td')

    // create end cell and button
    const action = document.createElement('td')
    action.colSpan = 2

    // check if item has an end time on load if not loads button and event listener
    if (!item.endTime) {
        const endBtn = document.createElement('button')
        endBtn.className = "btn end-btn"
        endBtn.textContent = 'End'
        
        // add event to end button
        endBtn.addEventListener('click', function() {
            const endTime = new Date()
            const elapsedMS = endTime.getTime() - item.startTime
            const minutes = Math.ceil(elapsedMS / 60000)

            item.endTime = endTime.getTime()
            saveToLocalStorage()

            // fill in empty cells from above
            endCell.textContent = endTime.toLocaleString([], { hour: '2-digit', minute: '2-digit' })
            elapsedCell.textContent = `${minutes} minutes`

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




startRt.addEventListener('click', function(e) {
    e.preventDefault()
    const name = who.value
    const type = rtType.value
    const startTime = new Date()
    
    const newItem = {
        name: name.toUpperCase(),
        type: type,
        startTime: startTime.getTime(),
        endTime: null
    }

    rtItems.push(newItem)
    saveToLocalStorage()
    createRow(newItem)
    form.reset()
})


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch((err) => console.log('❌ Service Worker error:', err));
  }

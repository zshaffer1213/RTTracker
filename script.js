const who = document.getElementById('name')
const rtType = document.getElementById('rt-type')
const startRt = document.getElementById('start-rt')
const tableBody = document.getElementById('table-body')
const form = document.querySelector('form')



startRt.addEventListener('click', function(e) {
    e.preventDefault()
    const name = who.value
    const type = rtType.value
    const startTime = new Date()
    
    // create row
    const row = document.createElement('tr')

    // create name cell
    const nameCell = document.createElement('td')
    nameCell.textContent = name.toUpperCase()

    // create rt type cell
    const typeCell = document.createElement('td')
    typeCell.textContent = type

    // create start time cell
    const startCell = document.createElement('td')
    startCell.textContent = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // crate empty end and elapsed cells for data later on
    const endCell = document.createElement('td')
    const elapsedCell = document.createElement('td')

    // create end cell and button
    const action = document.createElement('td')
    action.colSpan = 2
    const endBtn = document.createElement('button')
    endBtn.className = "btn end-btn"
    endBtn.textContent = 'End'
    
    // save time in ms as a dataset atrr
    endBtn.dataset.startTime = startTime.getTime()

    // addevent to end button
    endBtn.addEventListener('click', function() {
        const endTime = new Date()
        const start = Number(endBtn.dataset.startTime)
        const elapsedMS = endTime.getTime() - start
        const minutes = Math.ceil(elapsedMS / 60000)

        // fill in empty cells from above
        endCell.textContent = endTime.toLocaleString([], { hour: '2-digit', minute: '2-digit' })
        elapsedCell.textContent = `${minutes} minutes`

        action.remove()
        row.append(endCell, elapsedCell)

    })    
    
    action.append(endBtn)
    
    row.append(nameCell, typeCell, startCell, action)
    tableBody.append(row)

    form.reset()
})




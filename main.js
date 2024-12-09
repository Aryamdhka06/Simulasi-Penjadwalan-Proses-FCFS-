let processes = [];

document.getElementById('addProcess').addEventListener('click', () => {
    const id = document.getElementById('processId').value;
    const burstTime = parseInt(document.getElementById('burstTime').value);
    const arrivalTime = parseInt(document.getElementById('arrivalTime').value);
    if (id && burstTime > 0) {
        processes.push({ id, burstTime, arrivalTime });
        displayProcesses();
        document.getElementById('processId').value = '';
        document.getElementById('burstTime').value = '';
        document.getElementById('arrivalTime').value = '';
    }
});

function displayProcesses() {
    const processList = document.getElementById('processList');
    processList.innerHTML = processes.map((p, index) =>
        `<div>Proses ${index + 1}: ID = ${p.id}, Arrival = ${p.arrivalTime}, Burst Time = ${p.burstTime}</div>`
    ).join('');
}

document.getElementById('startSimulation').addEventListener('click', () => {
    const { waitingTimes, turnaroundTimes } = calculateResults(
        processes.map(p => p.id),
        processes.map(p => p.arrivalTime),
        processes.map(p => p.burstTime)
    );

    displayResults(waitingTimes, turnaroundTimes);
});

function calculateResults(processes, arrivalTimes, burstTimes) {
    let n = processes.length;
    let waitingTimes = new Array(n).fill(0);
    let turnaroundTimes = new Array(n).fill(0);
    let startTime = 0;
    let finishTimes = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
        startTime = Math.max(startTime, arrivalTimes[i]);
        finishTimes[i] = startTime + burstTimes[i];
        turnaroundTimes[i] = finishTimes[i] - arrivalTimes[i];
        waitingTimes[i] = turnaroundTimes[i] - burstTimes[i];
        startTime = finishTimes[i];
    }

    return { waitingTimes, turnaroundTimes };
}

function displayResults(waitingTimes, turnaroundTimes) {
    const resultTableBody = document.querySelector('#resultTable tbody');
    const avgWait = document.getElementById('avgWait');
    const avgTurnaround = document.getElementById('avgTurnaround');

    resultTableBody.innerHTML = processes.map((p, index) =>
        `<tr>
            <td>${p.id}</td>
            <td>${p.burstTime}</td>
            <td>${waitingTimes[index]}</td>
            <td>${turnaroundTimes[index]}</td>
        </tr>`
    ).join('');

    const avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / processes.length;
    const avgTurnaroundTime = turnaroundTimes.reduce((a, b) => a + b, 0) / processes.length;

    avgWait.textContent = avgWaitingTime.toFixed(2);
    avgTurnaround.textContent = avgTurnaroundTime.toFixed(2);
}

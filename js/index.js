const STORAGE_KEY = 'tiktok_rewards_state';

let appState = {
    balance: 0.00,
    transactions: [
        { id: '1', type: 'in', amount: 0.00, date: new Date().toISOString(), title: 'LIVE-belønninger' }
    ]
};

function initApp() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            appState = JSON.parse(saved);
        } catch (e) { console.error(e); }
    }
    updateDashboard();

    const nå = new Date();
    const måneder = ["jan.", "feb.", "mars", "apr.", "mai", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "des."];
    document.getElementById('current-month-label').innerText = `${måneder[nå.getMonth()]} ${nå.getFullYear()}`;
}

function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'decimal'
    }).format(amount);
}

function formatDate(isoString) {
    const d = new Date(isoString);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

function updateDashboard() {
    const formatted = formatMoney(appState.balance);
    document.getElementById('main-balance').innerText = formatted;
    document.getElementById('tab-balance').innerText = formatted;
    document.getElementById('ars-balance').innerText = formatMoney(appState.balance * 1495.99);

    const list = document.getElementById('transaction-list');
    list.innerHTML = '';

    let totalIn = 0;
    let totalOut = 0;

    const sortedTx = [...appState.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedTx.forEach(tx => {
        if (tx.type === 'in') totalIn += tx.amount;
        if (tx.type === 'out') totalOut += tx.amount;

        const sign = tx.type === 'in' ? '+' : '-';

        list.innerHTML += `
                    <div class="px-4 py-3.5 border-b border-gray-50 flex justify-between items-center bg-white">
                        <div>
                            <div class="text-[15px] font-medium text-gray-900">${tx.title}</div>
                            <div class="text-[12px] text-gray-400 mt-0.5">${formatDate(tx.date)}</div>
                        </div>
                        <div class="text-[15px] font-medium text-gray-900">
                            ${sign}USD${formatMoney(tx.amount)}
                        </div>
                    </div>
                `;
    });

    document.getElementById('total-in').innerText = formatMoney(totalIn);
    document.getElementById('total-out').innerText = formatMoney(totalOut);
}

function openEditModal() {
    document.getElementById('edit-balance-input').value = appState.balance.toFixed(2);
    document.getElementById('edit-balance-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-balance-modal').classList.add('hidden');
}

function saveNewBalance() {
    const newBal = parseFloat(document.getElementById('edit-balance-input').value);
    if (!isNaN(newBal) && newBal >= 0) {
        appState.balance = newBal;
        appState.transactions.unshift({
            id: Date.now().toString(),
            type: 'in',
            amount: newBal,
            date: new Date().toISOString(),
            title: 'LIVE-belønninger'
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        updateDashboard();
        closeEditModal();
    }
}

window.onload = initApp;
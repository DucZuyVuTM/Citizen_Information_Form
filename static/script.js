// Hàm tải lại danh sách lịch sử công dân
async function loadHistory() {
    try {
        const response = await fetch('/history');
        const historyData = await response.json();

        const historyList = document.getElementById('history-list');
        historyList.innerHTML = ''; // Xóa danh sách cũ

        // Kiểm tra nếu historyData là mảng và mảng không rỗng
        if (Array.isArray(historyData) && historyData.length > 0) {
            historyData.forEach((entry) => {
                const li = document.createElement('li');
                li.classList.add('summary-info');
                li.textContent = `${entry.name}, DOB: ${entry.date_of_birth}, Citizen Code: ${entry.citizen_code}`;
                historyList.appendChild(li);
            });
        } else {
            if (!Array.isArray(historyData)) console.log("Invalid history data:", historyData);
            historyList.innerHTML = '<li>No citizens found</li>';
        }
    } catch (error) {
        console.error("Failed to load history:", error);
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '<li>Error loading history</li>';
    }
}

// Hàm gửi dữ liệu công dân mới vào cơ sở dữ liệu
async function submitCitizenData(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const dateOfBirth = document.getElementById('date_of_birth').value;
    const citizenCode = document.getElementById('add_citizen_code').value;

    if (!name || !dateOfBirth || !citizenCode) {
        alert("Please fill all fields");
        return;
    }
    
    try {
        const response = await fetch('/collect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                date_of_birth: dateOfBirth,
                citizen_code: citizenCode
            })
        });

        if (response.ok) {
            loadHistory();
            // Xóa form sau khi gửi thành công
            document.getElementById('name').value = '';
            document.getElementById('date_of_birth').value = '';
            document.getElementById('add_citizen_code').value = '';
        } else {
            const errorData = await response.json();
            console.error("Failed to submit data:", errorData.error || response.statusText);
            alert("Failed to submit: " + (errorData.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error occurred while submitting data:", error);
        alert("Error submitting data");
    }
}

// Hàm xóa công dân
async function deleteCitizen(event) {
    event.preventDefault();

    const citizenCode = document.getElementById('del_citizen_code').value;
    const password = document.getElementById('password').value;

    if (!citizenCode || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch('/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                citizen_code: citizenCode,
                password: password
            })
        });

        if (response.ok) {
            loadHistory();
            document.getElementById('del_citizen_code').value = '';
            document.getElementById('password').value = '';
        } else {
            const errorData = await response.json();
            console.error("Failed to delete citizen:", errorData.error || response.statusText);
            alert("Failed to delete: " + (errorData.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Failed to delete citizen:", error);
        alert("Error deleting citizen");
    }
}

// Gắn sự kiện
document.getElementById('add-form').addEventListener('submit', submitCitizenData);
document.getElementById('delete-form').addEventListener('submit', deleteCitizen);
window.onload = loadHistory;
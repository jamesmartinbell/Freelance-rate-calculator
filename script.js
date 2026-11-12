document.getElementById('rateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const monthlyIncome = parseFloat(document.getElementById('monthly_income').value);
    const taxRate = parseFloat(document.getElementById('tax_rate').value) / 100;
    const workingHours = parseInt(document.getElementById('working_hours').value);

    if (isNaN(monthlyIncome) || isNaN(taxRate) || isNaN(workingHours)) {
        alert('Please enter valid numbers for all fields.');
        return;
    }

    const hourlyRate = (monthlyIncome * (1 - taxRate)) / (workingHours * 4.33);
    document.getElementById('hourly_rate').textContent = hourlyRate.toFixed(2);
});


function generateQRCode(text, callback) {
    var qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    return callback(qr.createImgTag());
}



document.getElementById('download-pdf-btn').addEventListener('click', function() {
    // Create a temporary container to hold the form and result for PDF generation
    var tempContainer = document.createElement('div');
    tempContainer.innerHTML = `
        <div id="rateForm">
            <h1>Freelance Rate Calculator</h1>
            <form id="rateForm">
                <label for="monthly_income">Monthly Income:</label><br>
                <input type="number" id="monthly_income" name="monthly_income" required><br>
                <label for="tax_rate">Tax Rate (%):</label><br>
                <input type="number" id="tax_rate" name="tax_rate" required><br>
                <label for="working_hours">Working Hours per Week:</label><br>
                <input type="number" id="working_hours" name="working_hours" required><br>
                <button type="submit">Calculate</button>
            </form>
        </div>
        <div id="result">
            <h2>Recommended Hourly Rate: <span id="hourly_rate"></span> EUR/hour</h2>
        </div>
    `;

    // Append the temporary container to the body
    document.body.appendChild(tempContainer);

    // Trigger the form submission to calculate the hourly rate and populate the result
    document.getElementById('rateForm').dispatchEvent(new Event('submit'));

    // Generate the QR code with the current URL
    generateQRCode(window.location.href, function(imgTag) {
        // Append the QR code to the temporary container
        tempContainer.innerHTML += imgTag;

        // Create a new container to hold the QR code image
        var qrContainer = document.createElement('div');
        qrContainer.innerHTML = imgTag;
        qrContainer.style.position = 'absolute';
        qrContainer.style.top = '50%';
        qrContainer.style.left = '50%';
        qrContainer.style.transform = 'translate(-50%, -50%)';

        // Append the QR code container to the temporary container
        tempContainer.appendChild(qrContainer);

        // Optionally, you can also add a close button to remove the QR code
        var closeButton = document.createElement('button');
        closeButton.innerHTML = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(qrContainer);
        });
        tempContainer.appendChild(closeButton);

        // Generate the PDF
        html2pdf(tempContainer, {
            margin: 10,
            filename: 'freelance_rate_calculator.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        });

        // Remove the temporary container from the body
        document.body.removeChild(tempContainer);
    });
});
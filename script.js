document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('emailForm');
    emailForm.addEventListener('submit', (event) => {

        const userInput = document.getElementById('email').value;
        
        // kontrollime et email oleks pariselt email mitte mingi spam pask
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(userInput)) {
            alert('Palun sisestage kehtiv meiliaadress!');
            event.preventDefault(); // teeb nii, et leht ei refreshi kui vale meili paneb
            return; // lõpetab funktsiooni, kui sisend ei vasta e-maili formaadile
        }
        
        // kui email on korrektses formaadis siis saadame selle vända andmebaasi
        fetch('https://kool.krister.ee/chat/frederik', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput: userInput })
        });
    });

    // Admin login vormi esitamine
    document.getElementById('admin').addEventListener('submit', async (event) => {
        event.preventDefault();

        const password = document.getElementById('password').value;

        if (password === 'Parool') {
            try {
                const response = await fetch('https://kool.krister.ee/chat/frederik', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();

                    // Kuvame emailid ja lisame kopeerimise nupu
                    document.body.innerHTML = `
                        <h1>All Submitted Emails and Inputs:</h1>
                        <ul id="emailList"></ul>
                        <button id="copyButton">Copy All Emails</button>
                    `;

                    const emailList = document.getElementById('emailList');
                    const emails = [];

                    data.forEach(item => {
                        if (item.userInput) {
                            emails.push(item.userInput);
                            const listItem = document.createElement('li');
                            listItem.textContent = item.userInput;
                            emailList.appendChild(listItem);
                        }
                    });

                    // Kopeerimise nupp
                    document.getElementById('copyButton').addEventListener('click', () => {
                        navigator.clipboard.writeText(emails.join('\n')).then(() => {
                            alert('All emails copied to clipboard!');
                        }).catch(err => {
                            alert('Failed to copy emails.');
                            console.error(err);
                        });
                    });
                } else {
                    alert('Failed to fetch data from the database.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while fetching data.');
            }
        } else {
            alert('Parool on vale');
        }
    });
});
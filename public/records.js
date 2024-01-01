const dns_records_list = document.getElementById('dns-records-list');

async function loadDNSRecords()
{
    dns_records_list.innerHTML = '';

    try
    {
        let response = await fetch('/dns-records');

        const records = await response.json();

        console.log(records);

        records.forEach(record => 
        {
            console.log(record);
            let li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = record.name;
            dns_records_list.appendChild(li);
        });

        if (records.length === 0)
        {
            let li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = 'No DNS records found';
            dns_records_list.appendChild(li);
        }
    } 
    catch (error)
    {
    }
}
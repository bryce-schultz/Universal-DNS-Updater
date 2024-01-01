const dns_providers_list = document.getElementById('dns-providers-list');

class Provider
{
    constructor(name, url, params)
    {
        this.name = name;
        this.url = url;
        this.params = params;
    }
}

async function getDNSProviders()
{
    try
    {
        let response = await fetch('/dns-providers');

        const providers = await response.json();

        return providers;
    } 
    catch (error)
    {
    }
}

async function loadDNSProviders()
{
    dns_providers_list.innerHTML = '';

    const providers = await getDNSProviders();

    providers.forEach(provider => 
    {
        let li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = provider.name;
        dns_providers_list.appendChild(li);
    });

    if (providers.length === 0)
    {
        let li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = 'No DNS providers found';
        dns_providers_list.appendChild(li);
    }
}